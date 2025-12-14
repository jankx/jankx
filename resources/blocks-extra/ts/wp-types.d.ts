/**
 * WordPress Global Type Definitions
 * 
 * Declaration file for WordPress global objects and components
 * to avoid duplicate declarations and provide proper typing.
 */

declare global {
    namespace wp {
        namespace hooks {
            function addFilter(
                hookName: string,
                namespace: string,
                callback: Function
            ): void;
        }
        
        namespace dom {
            function ready(callback: () => void): void;
        }
        
        namespace element {
            const createElement: any; // WordPress uses its own createElement
            type ComponentType<P = {}> = any;
        }
        
        namespace components {
            const PanelBody: any;
            const SelectControl: any;
        }
        
        namespace blockEditor {
            const InspectorControls: any;
            
            interface BlockEditProps {
                name: string;
                attributes: Record<string, any>;
                setAttributes: (attributes: Record<string, any>) => void;
                isSelected: boolean;
            }
        }
    }
    
    // React global for JSX
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export {};
