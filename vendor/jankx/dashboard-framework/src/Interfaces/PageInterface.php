<?php

namespace Jankx\Dashboard\Interfaces;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

interface PageInterface
{
    public function getTitle();
}
