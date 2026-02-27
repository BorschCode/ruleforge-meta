export const testRules = [
    {
        id: 1,
        name: 'High Spender - €10k+',
        priority: 10,
        isActive: true,
        matchedAccounts: 234,
        tags: ['high-spender', 'priority-monitoring'],
        lastRun: '2 minutes ago',
        conditions: [
            {
                id: 'cond_1',
                type: 'spend',
                field: 'spend_30d',
                operator: '>',
                value: 10000,
            },
        ],
        actions: [
            {
                id: 'act_1',
                type: 'add_tag',
                tags: ['high-spender', 'priority-monitoring'],
            },
        ],
    },
    {
        id: 2,
        name: 'Agency X - Premium',
        priority: 8,
        isActive: true,
        matchedAccounts: 89,
        tags: ['agency-x', 'premium', 'smm-boost-enabled'],
        lastRun: '2 minutes ago',
        conditions: [
            {
                id: 'cond_1',
                type: 'spend',
                field: 'spend_30d',
                operator: '>',
                value: 5000,
            },
            {
                id: 'cond_2',
                type: 'client',
                field: 'client.name',
                operator: 'contains',
                value: 'Agency X',
                logic: 'AND',
            },
        ],
        actions: [
            {
                id: 'act_1',
                type: 'add_tag',
                tags: ['agency-x', 'premium'],
            },
            {
                id: 'act_2',
                type: 'set_metadata',
                metadata: {
                    priority: 'high',
                    smm_boost_enabled: true,
                    ai_analysis_enabled: true,
                },
            },
        ],
    },
    {
        id: 3,
        name: 'Inactive Accounts',
        priority: 3,
        isActive: false,
        matchedAccounts: 1523,
        tags: ['inactive', 'skip-sync'],
        lastRun: '1 hour ago',
        conditions: [
            {
                id: 'cond_1',
                type: 'count',
                field: 'campaigns_count',
                operator: '=',
                value: 0,
                logic: 'OR',
            },
            {
                id: 'cond_2',
                type: 'spend',
                field: 'spend_30d',
                operator: '=',
                value: 0,
            },
        ],
        actions: [
            {
                id: 'act_1',
                type: 'add_tag',
                tags: ['inactive'],
            },
            {
                id: 'act_2',
                type: 'set_metadata',
                metadata: {
                    skip_sync: true,
                },
            },
        ],
    },
];

export const availableTags = [
    { id: 1, name: 'high-spender', color: '#10b981' },
    { id: 2, name: 'agency-x-premium', color: '#3b82f6' },
    { id: 3, name: 'priority-monitoring', color: '#f59e0b' },
    { id: 4, name: 'smm-boost-enabled', color: '#8b5cf6' },
    { id: 5, name: 'ai-analysis-enabled', color: '#ec4899' },
    { id: 6, name: 'inactive', color: '#6b7280' },
    { id: 7, name: 'high-volume', color: '#14b8a6' },
];

export const sampleAccounts = [
    {
        id: 'act_12345',
        name: 'Agency X - Client A',
        spend: 12450,
        campaigns: 15,
    },
    {
        id: 'act_67890',
        name: 'Agency X - Client B',
        spend: 10200,
        campaigns: 8,
    },
    {
        id: 'act_11111',
        name: 'Agency X - Premium',
        spend: 25000,
        campaigns: 32,
    },
    { id: 'act_22222', name: 'Direct Client 1', spend: 15000, campaigns: 22 },
    {
        id: 'act_33333',
        name: 'Agency Y - Client Z',
        spend: 8500,
        campaigns: 12,
    },
];

export const conditionBlocks = [
    {
        type: 'spend',
        label: 'Spend',
        icon: '💰',
        color: 'green',
        fields: [
            { value: 'spend_7d', label: 'Spend (Last 7 days)' },
            { value: 'spend_30d', label: 'Spend (Last 30 days)' },
            { value: 'spend_lifetime', label: 'Spend (Lifetime)' },
        ],
        operators: [
            { value: '>', label: 'Greater than' },
            { value: '>=', label: 'Greater or equal' },
            { value: '<', label: 'Less than' },
            { value: '<=', label: 'Less or equal' },
            { value: '=', label: 'Equal to' },
            { value: '!=', label: 'Not equal to' },
        ],
    },
    {
        type: 'count',
        label: 'Campaign Count',
        icon: '📊',
        color: 'blue',
        fields: [
            { value: 'campaigns_count', label: 'Total Campaigns' },
            { value: 'active_campaigns_count', label: 'Active Campaigns' },
            { value: 'posts_count', label: 'Posts Count' },
        ],
        operators: [
            { value: '>', label: 'Greater than' },
            { value: '>=', label: 'Greater or equal' },
            { value: '<', label: 'Less than' },
            { value: '<=', label: 'Less or equal' },
            { value: '=', label: 'Equal to' },
            { value: '!=', label: 'Not equal to' },
        ],
    },
    {
        type: 'client',
        label: 'Client/Agency',
        icon: '👤',
        color: 'purple',
        fields: [
            { value: 'client.name', label: 'Client Name' },
            { value: 'client.type', label: 'Client Type' },
            { value: 'client.tier', label: 'Client Tier' },
        ],
        operators: [
            { value: 'contains', label: 'Contains' },
            { value: 'equals', label: 'Equals' },
            { value: 'starts_with', label: 'Starts with' },
            { value: 'ends_with', label: 'Ends with' },
        ],
    },
    {
        type: 'date',
        label: 'Date Range',
        icon: '📅',
        color: 'orange',
        fields: [
            { value: 'created_at', label: 'Created Date' },
            { value: 'last_synced_at', label: 'Last Synced' },
        ],
        operators: [
            { value: 'after', label: 'After' },
            { value: 'before', label: 'Before' },
            { value: 'between', label: 'Between' },
        ],
    },
    {
        type: 'tag',
        label: 'Has Tag',
        icon: '🏷️',
        color: 'pink',
        fields: [{ value: 'tags.name', label: 'Tag Name' }],
        operators: [
            { value: 'has', label: 'Has tag' },
            { value: 'not_has', label: 'Does not have tag' },
        ],
    },
];

export const actionBlocks = [
    {
        type: 'add_tag',
        label: 'Add Tags',
        icon: '🏷️',
        color: 'blue',
    },
    {
        type: 'set_metadata',
        label: 'Set Metadata',
        icon: '⚙️',
        color: 'gray',
    },
    {
        type: 'notify',
        label: 'Send Notification',
        icon: '📧',
        color: 'yellow',
    },
    {
        type: 'trigger',
        label: 'Trigger Action',
        icon: '🚀',
        color: 'red',
    },
];

export const clientOptions = [
    { value: 'Agency X', label: 'Agency X (200 accounts)' },
    { value: 'Agency Y', label: 'Agency Y (100 accounts)' },
    { value: 'Agency Z', label: 'Agency Z (150 accounts)' },
];

export const metadataOptions = {
    priority: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ],
    syncFrequency: [
        { value: '15min', label: 'Every 15 minutes' },
        { value: '30min', label: 'Every 30 minutes' },
        { value: '1hour', label: 'Every hour' },
        { value: 'manual', label: 'Manual only' },
    ],
};
