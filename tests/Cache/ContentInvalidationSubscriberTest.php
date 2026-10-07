<?php

namespace Tests\Cache;

use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;
use Jankx\Cache\Invalidation\ContentInvalidationSubscriber;
use Tests\Helpers\TestCase;

/**
 * The promise of this suite: whatever WordPress writes, something listens and
 * clears the layers that just went stale — and nothing else moves.
 */
class ContentInvalidationSubscriberTest extends TestCase
{
    /**
     * @var PageCacheInterface&\PHPUnit\Framework\MockObject\MockObject
     */
    private $pageCache;

    /**
     * @var QueryCacheInterface&\PHPUnit\Framework\MockObject\MockObject
     */
    private $queryCache;

    /**
     * @var ContentInvalidationSubscriber
     */
    private $subscriber;

    protected function setUp(): void
    {
        parent::setUp();

        unset($GLOBALS['wp_hooks']['actions']);

        $this->pageCache = $this->createMock(PageCacheInterface::class);
        $this->queryCache = $this->createMock(QueryCacheInterface::class);
        $this->subscriber = new ContentInvalidationSubscriber(
            $this->pageCache,
            $this->queryCache,
            ['enabled' => true, 'bucket' => 'posts']
        );
    }

    public function testEveryDataChangeIsObserved()
    {
        $this->subscriber->subscribe();

        $expected = [
            'save_post'                  => 'onSavePost',
            'trashed_post'               => 'onPostTrashed',
            'untrashed_post'             => 'onPostTrashed',
            'deleted_post'               => 'onPostDeleted',
            'created_term'               => 'onTermChanged',
            'edited_term'                => 'onTermChanged',
            'delete_term'                => 'onTermDeleted',
            'set_object_terms'           => 'onObjectTermsChanged',
            'wp_insert_comment'          => 'onCommentInserted',
            'transition_comment_status'  => 'onCommentStatusChanged',
            'edit_comment'               => 'onCommentEdited',
            'deleted_comment'            => 'onCommentDeleted',
            'wp_update_nav_menu'         => 'onMarkupChanged',
            'wp_delete_nav_menu'         => 'onMarkupChanged',
            'user_register'              => 'onMarkupChanged',
            'profile_update'             => 'onMarkupChanged',
            'deleted_user'               => 'onMarkupChanged',
            'add_option'                 => 'onOptionChanged',
            'update_option'              => 'onOptionChanged',
            'delete_option'              => 'onOptionChanged',
            'switch_theme'               => 'onEverythingChanged',
            'upgrader_process_complete'  => 'onEverythingChanged',
            'customize_save_after'       => 'onEverythingChanged',
        ];

        foreach ($expected as $tag => $method) {
            $this->assertTrue(
                $this->hooked($tag, [$this->subscriber, $method]),
                "Expected {$tag} → {$method}"
            );
        }
    }

    public function testPostSaveBumpsTheQueryBucketAndPurgesItsPages()
    {
        $this->queryCache->expects($this->once())
            ->method('flushBucket')
            ->with('posts');

        $this->pageCache->expects($this->once())
            ->method('purge')
            ->with(
                $this->callback(static function ($tags) {
                    return in_array('post-7', $tags, true)
                        && in_array('type-post', $tags, true)
                        && in_array('all', $tags, true);
                }),
                $this->callback(static function ($urls) {
                    return in_array('http://example.com/p/7', $urls, true);
                })
            );

        $this->subscriber->onSavePost(7, (object) ['post_type' => 'post'], true);
    }

    public function testTrashAndUntrashAreObservedToo()
    {
        $this->queryCache->expects($this->once())->method('flushBucket')->with('posts');
        $this->pageCache->expects($this->once())->method('purge');

        $this->subscriber->onPostTrashed(7, 'publish');
    }

    public function testTermCreatedAndDeletedPurgeTermPages()
    {
        $this->queryCache->expects($this->once())->method('flushBucket');

        $this->pageCache->expects($this->once())
            ->method('purge')
            ->with(
                $this->callback(static function ($tags) {
                    return in_array('term-3', $tags, true)
                        && in_array('taxonomy-category', $tags, true);
                }),
                $this->anything()
            );

        $this->subscriber->onTermChanged(3, 1, 'category');
    }

    public function testAttachingTermsToAPostPurgesThatPost()
    {
        $this->queryCache->expects($this->once())->method('flushBucket');

        $this->pageCache->expects($this->once())
            ->method('purge')
            ->with(
                $this->callback(static function ($tags) {
                    return in_array('post-7', $tags, true)
                        && in_array('taxonomy-category', $tags, true);
                }),
                $this->anything()
            );

        $this->subscriber->onObjectTermsChanged(7, [3], [11], 'category', false);
    }

    public function testCommentChangesPurgeThePostTheyBelongTo()
    {
        $comment = (object) ['comment_post_ID' => 7];

        $this->queryCache->expects($this->once())->method('flushBucket');

        $this->pageCache->expects($this->once())
            ->method('purge')
            ->with(
                $this->callback(static function ($tags) {
                    return in_array('post-7', $tags, true);
                }),
                $this->anything()
            );

        $this->subscriber->onCommentStatusChanged('approved', 'unapproved', $comment);
    }

    public function testMenusAndUsersDropPagesButKeepTheQueryCache()
    {
        $this->queryCache->expects($this->never())->method('flushBucket');
        $this->pageCache->expects($this->exactly(2))->method('purge');

        $this->subscriber->onMarkupChanged(3);
        $this->subscriber->onMarkupChanged(15, null);
    }

    public function testFrontOptionsInvalidateWhileUnknownOptionsStayQuiet()
    {
        $this->queryCache->expects($this->once())->method('flushBucket');
        $this->pageCache->expects($this->once())->method('purge');

        $this->subscriber->onOptionChanged('blogname', 'Old', 'New');
        $this->subscriber->onOptionChanged('some_plugin_internal_flag', 1, 2);
    }

    public function testWidgetAndThemeModOptionsDropPagesOnly()
    {
        $this->queryCache->expects($this->never())->method('flushBucket');
        $this->pageCache->expects($this->exactly(2))->method('purge');

        $this->subscriber->onOptionChanged('widget_text', [], ['instance' => 1]);
        $this->subscriber->onOptionChanged('theme_mods_jankx', [], []);
    }

    public function testThemeSwitchFlushesBothLayers()
    {
        $this->queryCache->expects($this->once())->method('flush');
        $this->pageCache->expects($this->once())->method('purge')->with(['all'], []);

        $this->subscriber->onEverythingChanged();
    }

    public function testDisabledQueryCacheStillPurgesPages()
    {
        $subscriber = new ContentInvalidationSubscriber($this->pageCache, $this->queryCache, ['enabled' => false]);

        $this->queryCache->expects($this->never())->method('flushBucket');
        $this->pageCache->expects($this->once())->method('purge');

        $subscriber->onSavePost(7, (object) ['post_type' => 'post'], true);
    }

    /**
     * @param string $tag      Hook name.
     * @param array  $callback Registered callback.
     * @return bool
     */
    private function hooked($tag, array $callback): bool
    {
        foreach ($GLOBALS['wp_hooks']['actions'][$tag] ?? [] as $callbacks) {
            foreach ($callbacks as $registered) {
                if ($registered === $callback) {
                    return true;
                }
            }
        }

        return false;
    }
}
