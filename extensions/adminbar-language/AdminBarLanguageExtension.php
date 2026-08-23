<?php

namespace Jankx\Extensions\AdminBarLanguage;

use Jankx\Extensions\AbstractExtension;

class AdminBarLanguageExtension extends AbstractExtension
{
    public function init(): void
    {
        $this->name = 'Admin Bar Language';
        $this->version = '1.0.0';
    }

    public function register_hooks(): void
    {
    }

    public function getUserLocale(string $locale): string
    {
        if (is_admin() || !is_user_logged_in()) {
            return $locale;
        }

        return get_user_locale(get_current_user_id());
    }
}
