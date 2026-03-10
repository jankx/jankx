<?php

namespace Jankx\Gutenberg\Layouts;

use Jankx\Foundation\Application;

class LayoutReferenceGenerator
{
    protected $app;
    protected $outputDir;

    public function __construct(Application $app, string $outputDir)
    {
        $this->app = $app;
        $this->outputDir = $outputDir;
    }

    public function generate(array $sources)
    {
        $summary = [];

        foreach ($sources as $type => $dir) {
            if (!is_dir($dir)) {
                echo "Info: Directory not found: $dir\n";
                continue;
            }

            $files = glob($dir . '/*.html');
            if (empty($files)) {
                continue;
            }

            foreach ($files as $file) {
                $name = basename($file);
                $content = file_get_contents($file);
                $slug = basename($file, '.html');
                $id = "{$type}/" . $slug;

                echo "Processing {$type}: {$name}...\n";

                $summary[] = [
                    'id' => $id,
                    'type' => $type,
                    'slug' => $slug,
                    'name' => $name,
                    'path' => str_replace(get_template_directory(), '', $file),
                    'markup' => $content,
                ];

                // Save a copy of the HTML file in the output dir for easy access by AI
                // Use a standard filename format
                $outputFilename = "{$type}--{$slug}.html";
                $outputFile = $this->outputDir . '/' . $outputFilename;
                
                // Add some metadata at the top of the file as an HTML comment for AI
                $idLine = "<!-- ID: {$id} -->\n";
                $typeLine = "<!-- Type: {$type} -->\n";
                $pathLine = "<!-- Path: " . str_replace(get_template_directory(), '', $file) . " -->\n";
                
                file_put_contents($outputFile, $idLine . $typeLine . $pathLine . $content);
            }
        }

        file_put_contents(
            $this->outputDir . '/summary.json',
            json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }
}
