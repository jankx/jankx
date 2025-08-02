import Field from './Field';
import { Box, Text, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export default class IconField extends Field {
    openIconPicker() {
        if (typeof wp.media.view.MediaFrame.IconPicker === 'undefined') {
            console.error('Icon Picker not found');
            return;
        }

        wp.media.view.MediaFrame.IconPicker.selectIcon({
            target: this.id,
            onSelect: (icon) => {
                this.onChange(this.id, icon);
            }
        });
    }

    render(formData) {
        const value = this.getValue(formData);

        return (
            <Box key={this.id}>
                <Text fontSize="xl">{this.field.title}</Text>
                <Box sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    {value ? (
                        <Box sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #ddd',
                            borderRadius: 1
                        }}>
                            <i className={value}></i>
                        </Box>
                    ) : null}

                    <IconButton
                        onClick={() => this.openIconPicker()}
                        sx={{
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            width: 40,
                            height: 40
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>
        );
    }
}