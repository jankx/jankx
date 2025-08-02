import React from 'react';
import { Box, Text, Button, Link } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const FrameworkInfo = ({ config }) => {
    const { logo, version, description } = config;

    return (
        <Box sx={{ mb: 4 }}>
            {version && (
                <Text variant="subtitle2" color="textSecondary">
                    Version {version}
                </Text>
            )}
            {description && (
                <Text variant="body2" sx={{ mt: 1 }}>
                    {description}
                </Text>
            )}
        </Box>
    );
};

export default FrameworkInfo;