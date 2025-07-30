<?php

namespace Jankx\Contracts;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


interface ContextInterface
{
    public function getValue(): string;
}
