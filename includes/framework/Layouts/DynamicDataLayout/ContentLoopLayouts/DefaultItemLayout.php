<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class DefaultItemLayout extends AbstractContentLoopLayout
{
    public function getName(): string
    {
        return 'default';
    }

    public function getTitle(): string
    {
        return 'Default';
    }
}
