<?php

namespace Jankx\Dashboard\Interfaces;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

interface SectionInterface
{
    public function getTitle();
}
