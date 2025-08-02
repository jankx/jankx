<?php

namespace Jankx\Dashboard\Elements\Fields;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Dashboard\Elements\Field;
use Jankx\Dashboard\Interfaces\Fields\IconFieldInterface;

class IconField extends Field implements IconFieldInterface
{
    protected $type = 'icon';
}