import api from '../services/api';
import { extractArrayPayload, LIST_PAYLOAD_KEYS } from '../utils/extractPayload';

const AREAS_LIST_KEYS = [...LIST_PAYLOAD_KEYS, 'areas'];

function mapArea(raw) {
    if (!raw || typeof raw !== 'object' || raw.id == null) {
        return null;
    }

    const name = String(raw.name ?? raw.title ?? raw.label ?? '').trim();

    return {
        id: String(raw.id),
        name: name || `Area ${raw.id}`,
    };
}

export async function fetchAdminAreas() {
    const response = await api.get('/admin/areas');
    const rawList = extractArrayPayload(response.data, AREAS_LIST_KEYS);
    return rawList.map(mapArea).filter(Boolean);
}
