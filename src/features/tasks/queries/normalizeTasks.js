import { extractArrayPayload } from '../../../utils/extractPayload';
import { mapTask } from '../utils/mapTask';

export function normalizeTasksPayload(payload) {
    const rawList = extractArrayPayload(payload);
    const tasks = rawList.map(mapTask).filter((item) => item?.id);

    const total = payload?.meta?.total ?? tasks.length;
    const urgentCount = tasks.filter((task) => task.isUrgent).length;
    const activeCount = tasks.filter((task) => task.status === 'In Progress').length;

    return {
        tasks,
        total,
        urgentCount,
        activeCount,
    };
}
