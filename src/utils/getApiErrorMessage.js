export function getApiErrorMessage(err, fallback) {
    return err?.response?.data?.message ?? err?.message ?? fallback;
}
