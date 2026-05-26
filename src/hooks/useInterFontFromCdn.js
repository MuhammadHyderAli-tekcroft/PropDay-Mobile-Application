import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

import { INTER_FONT_CDN } from '../theme/interFontCdn';

export function useInterFontFromCdn() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadFontsFromCdn() {
            try {
                await Font.loadAsync(INTER_FONT_CDN);
            } catch {
            } finally {
                if (!cancelled) {
                    setFontsLoaded(true);
                }
            }
        }

        loadFontsFromCdn();

        return () => {
            cancelled = true;
        };
    }, []);

    return fontsLoaded;
}
