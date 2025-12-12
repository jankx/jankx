<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

interface PostLayoutJsCallbackInterface
{
    public function needsJsInit(): bool;
    public function getJsInitKey(): string;
    public function getJsInitPayload(): array;
}

