<?php

namespace Jankx\Layouts\ContentLayout\Contracts;

interface ContentLayoutContract
{
    public function getName(): string;
    public function getTitle(): string;
    public function getIcon(): string;
    public function getSvgSkeleton(): string;
    public function getDescription(): string;
    public function getVersion(): string;
    public function getTemplate(): array;
    public function toArray(): array;
}
