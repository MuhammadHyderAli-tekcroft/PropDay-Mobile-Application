function formatTaskDueDate(value) {
    if (!value) {
        return '—';
    }

    const normalized = String(value).includes('T') ? value : String(value).replace(' ', 'T');
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function formatTaskableUnit(taskableType, taskableId) {
    if (taskableId == null) {
        return 'No unit';
    }

    const modelName = taskableType?.split('\\').pop() ?? 'Record';
    return `${modelName} #${taskableId}`;
}

function mapAssignee(assignedTo) {
    const name = assignedTo != null ? `User #${assignedTo}` : 'Unassigned';

    return {
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8E8E8&color=333`,
    };
}

export function mapTask(raw) {
    if (!raw || typeof raw !== 'object') {
        return null;
    }

    return {
        id: String(raw.id ?? ''),
        description: String(raw.description ?? '').trim() || 'No description',
        unit: formatTaskableUnit(raw.taskable_type, raw.taskable_id),
        taskType: 'Task',
        priority: raw.priority ?? 'Medium',
        isUrgent: Boolean(raw.is_urgent),
        status: raw.status ?? 'Pending',
        dueDate: formatTaskDueDate(raw.due_at ?? raw.meta?.start_date),
        assignee: mapAssignee(raw.assigned_to),
    };
}
