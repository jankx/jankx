export async function fetchAwaitRedirect(url) {
    const { status, redirected } = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
    return {
        isError: status >= 400,
        isRedirect: redirected,
    };
}
//# sourceMappingURL=fetch-await-redirect.js.map