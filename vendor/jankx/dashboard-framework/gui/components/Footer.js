import React from 'react';
import { Box, Text, Button, Link, IconButton, Flex } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin, FaBook, FaQuestionCircle } from 'react-icons/fa';

const Footer = ({ config }) => {
    const { social_links, support_url, documentation_url } = config;

    return (
        <Box borderTop="1px solid #ddd" mt={4} pt={2} pb={2}>
            <Flex justify="space-between" align="center">
                <Flex direction="row" gap={2}>
                    {social_links.facebook && (
                        <IconButton as="a" href={social_links.facebook} target="_blank" aria-label="Facebook" icon={<FaFacebook />} />
                    )}
                    {social_links.twitter && (
                        <IconButton as="a" href={social_links.twitter} target="_blank" aria-label="Twitter" icon={<FaTwitter />} />
                    )}
                    {social_links.github && (
                        <IconButton as="a" href={social_links.github} target="_blank" aria-label="GitHub" icon={<FaGithub />} />
                    )}
                    {social_links.linkedin && (
                        <IconButton as="a" href={social_links.linkedin} target="_blank" aria-label="LinkedIn" icon={<FaLinkedin />} />
                    )}
                </Flex>
                <Flex direction="row" gap={4}>
                    {support_url && (
                        <Link href={support_url} target="_blank" display="flex" alignItems="center">
                            <FaQuestionCircle style={{ marginRight: 4 }} />
                            <Text>Support</Text>
                        </Link>
                    )}
                    {documentation_url && (
                        <Link href={documentation_url} target="_blank" display="flex" alignItems="center">
                            <FaBook style={{ marginRight: 4 }} />
                            <Text>Documentation</Text>
                        </Link>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Footer;