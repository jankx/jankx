<?php

namespace Jankx\Layouts\PostLayout\Contracts;

interface PostLayoutJsCallbackInterface
{
    /**
     * Unique key to initialise JS (e.g., 'carousel').
     */
    public function getJsInitKey(): string;

    /**
     * Extra data passed to frontend initialiser.
     * @return array<string, mixed>
     */
    public function getJsInitPayload(): array;

    /**
     * Flag to tell front-end include script.
     */
    public function needsJsInit(): bool;
}
