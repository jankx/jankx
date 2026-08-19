<?php

namespace {

    if (!function_exists('post_type_exists')) {
        function post_type_exists($post_type)
        {
            return true;
        }
    }

    if (!function_exists('taxonomy_exists')) {
        function taxonomy_exists($taxonomy)
        {
            return true;
        }
    }

    if (!function_exists('wp_style_engine_get_styles')) {
        function wp_style_engine_get_styles($config)
        {
            return ['css' => ''];
        }
    }

    /**
     * Minimal WP_Term stand-in so the generator/renderer can be tested without a
     * full WordPress bootstrap.
     */
    class WP_Term
    {
        public $term_id;
        public $name;
        public $slug;
        public $term_group = 0;
        public $term_taxonomy_id;
        public $taxonomy;
        public $description;
        public $parent = 0;
        public $count = 0;

        public function __construct($args = [])
        {
            foreach ($args as $key => $value) {
                $this->{$key} = $value;
            }
        }
    }

    /**
     * Minimal WP_Term_Query stand-in. Results are injected via the static registry.
     */
    class WP_Term_Query
    {
        public static $mock_terms = [];
        public $args = [];

        public function __construct($args = [])
        {
            $this->args = $args;
        }

        public function get_terms()
        {
            return self::$mock_terms;
        }
    }
}

namespace Tests\Layouts\DynamicDataLayout {

    use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
    use Jankx\Layouts\DynamicDataLayout\BlockLayouts\GridLayout;
    use Jankx\Layouts\DynamicDataLayout\Generators\TermTemplateBlockGenerator;
    use Jankx\Layouts\DynamicDataLayout\TermBlockTemplateAttributeSanitizer;
    use Jankx\Layouts\DynamicDataLayout\TermBlockTemplateRenderer;
    use Tests\Helpers\TestCase;

    class TermBlockTemplateRendererTest extends TestCase
    {
        protected $layoutManager;
        protected $sanitizer;
        protected $renderer;

        protected function setUp(): void
        {
            parent::setUp();

            $this->layoutManager = BlockTemplateLayoutManager::getInstance();
            $this->sanitizer = new TermBlockTemplateAttributeSanitizer($this->layoutManager);
            $this->renderer = new TermBlockTemplateRenderer(
                $this->layoutManager,
                $this->sanitizer,
                function (array $data) {
                    return $data['postTemplate'] ?? null;
                },
                function ($template) {
                    return $template;
                },
                null
            );

            \WP_Term_Query::$mock_terms = [];
        }

        protected function makeTerm($args = [])
        {
            return new \WP_Term(array_merge([
                'term_id' => 1,
                'name' => 'News',
                'slug' => 'news',
                'taxonomy' => 'category',
                'description' => 'Latest news and updates.',
                'count' => 12,
                'parent' => 0,
            ], $args));
        }

        protected function makeTemplate()
        {
            return [
                'blockName' => 'jankx/dynamic-term-template',
                'attrs' => [],
                'innerBlocks' => [
                    [
                        'blockName' => 'core/post-title',
                        'attrs' => ['isLink' => true],
                        'innerBlocks' => [],
                        'innerContent' => [],
                    ],
                    [
                        'blockName' => 'core/post-excerpt',
                        'attrs' => [],
                        'innerBlocks' => [],
                        'innerContent' => [],
                    ],
                    [
                        'blockName' => 'core/paragraph',
                        'attrs' => ['className' => 'jankx-term-count'],
                        'innerBlocks' => [],
                        'innerContent' => [''],
                    ],
                ],
                'innerHTML' => '',
                'innerContent' => [''],
            ];
        }

        protected function makeAttributes()
        {
            return [
                'taxonomy' => 'category',
                'postsPerPage' => 10,
                'layout' => 'grid',
                'columns' => 3,
                'columnsTablet' => 2,
                'columnsMobile' => 1,
                'orderBy' => 'name',
                'order' => 'ASC',
                'hideEmpty' => true,
                'showTermCount' => true,
                'postTemplate' => $this->makeTemplate(),
            ];
        }

        public function testRendererRendersTermNameDescriptionAndCount()
        {
            \WP_Term_Query::$mock_terms = [
                $this->makeTerm(['term_id' => 1, 'name' => 'News', 'description' => 'Latest news.', 'count' => 12]),
                $this->makeTerm(['term_id' => 2, 'name' => 'Events', 'description' => 'Upcoming events.', 'count' => 5]),
            ];

            $html = $this->renderer->render($this->makeAttributes());

            // Wrapper uses the shared layout classes
            $this->assertStringContainsString('post-type-layout-grid', $html);
            $this->assertStringContainsString('columns-3', $html);

            // Item wrappers
            $this->assertStringContainsString('term-item', $html);

            // Term name + link
            $this->assertStringContainsString('News', $html);
            $this->assertStringContainsString('<a href="#">News</a>', $html);
            $this->assertStringContainsString('<a href="#">Events</a>', $html);

            // Term description
            $this->assertStringContainsString('Latest news.', $html);
            $this->assertStringContainsString('Upcoming events.', $html);

            // Term count
            $this->assertStringContainsString('jankx-term-count', $html);
            $this->assertStringContainsString('>12<', $html);
            $this->assertStringContainsString('>5<', $html);
        }

        public function testRendererReturnsEmptyStateWhenNoTerms()
        {
            \WP_Term_Query::$mock_terms = [];

            $html = $this->renderer->render($this->makeAttributes());

            $this->assertStringContainsString('wp-block-jankx-dynamic-term-layout empty-state', $html);
        }

        public function testRendererHonorsShowEmptyMessageFalse()
        {
            \WP_Term_Query::$mock_terms = [];

            $attributes = $this->makeAttributes();
            $attributes['showEmptyMessage'] = false;

            $this->assertSame('', $this->renderer->render($attributes));
        }

        public function testGeneratorFallsBackToDefaultItemWhenTemplateEmpty()
        {
            $generator = new TermTemplateBlockGenerator([], ['showTermCount' => true]);

            $terms = [
                $this->makeTerm(['term_id' => 1, 'name' => 'News', 'description' => 'Latest news.', 'count' => 12]),
            ];

            $html = $generator->generate($terms, ['layout' => 'grid', 'columns' => 3]);

            $this->assertStringContainsString('News', $html);
            $this->assertStringContainsString('Latest news.', $html);
            $this->assertStringContainsString('jankx-term-count', $html);
        }

        public function testGeneratorSkipsDescriptionWhenEmpty()
        {
            $generator = new TermTemplateBlockGenerator([], []);

            $terms = [
                $this->makeTerm(['term_id' => 1, 'name' => 'News', 'description' => '', 'count' => 3]),
            ];

            $html = $generator->generate($terms, ['layout' => 'grid', 'columns' => 3]);

            $this->assertStringContainsString('News', $html);
            $this->assertStringNotContainsString('wp-block-post-excerpt', $html);
        }

        public function testLayoutSetQueryAcceptsPlainArrayOfTerms()
        {
            $layout = new GridLayout();
            $terms = [$this->makeTerm()];

            $result = $layout->setQuery($terms);

            $this->assertInstanceOf(\Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface::class, $result);
            $this->assertSame($terms, $this->getProtectedProperty($layout, 'query'));
        }

        public function testSanitizerMapsOrderByAndOrderForTerms()
        {
            $attributes = [
                'taxonomy' => 'category',
                'postsPerPage' => 20,
                'orderBy' => 'count',
                'order' => 'desc',
                'termIn' => [3, 7, 'bad'],
                'termNotIn' => [1],
                'hideEmpty' => false,
            ];

            $sanitized = $this->sanitizer->sanitize($attributes);

            $this->assertSame('count', $sanitized['orderBy']);
            $this->assertSame('DESC', $sanitized['order']);
            $this->assertSame([3, 7], $sanitized['termIn']);
            $this->assertSame([1], $sanitized['termNotIn']);
            $this->assertSame(20, $sanitized['number']);
            $this->assertFalse($sanitized['hideEmpty']);
        }
    }
}
