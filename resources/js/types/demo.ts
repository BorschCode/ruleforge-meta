export type ConditionType = 'spend' | 'count' | 'client' | 'date' | 'tag';
export type ActionType = 'add_tag' | 'set_metadata' | 'notify' | 'trigger';
export type LogicOperator = 'AND' | 'OR';
export type NavItem = 'rules' | 'settings' | 'docs';

export interface Condition {
    id: string;
    type: ConditionType;
    field: string;
    operator: string;
    value: string | number;
    logic: LogicOperator;
}

export interface Action {
    id: string;
    type: ActionType;
    tags?: string[];
    metadata?: Record<string, unknown>;
    message?: string;
    channel?: string;
}

export interface Rule {
    id: string;
    name: string;
    priority: number;
    isActive: boolean;
    conditions: Condition[];
    actions: Action[];
    logic: LogicOperator;
}

export interface GlobalSettings {
    currency: 'EUR' | 'USD';
    defaultWindow: '7d' | '30d';
    aiEnabled: boolean;
    defaultPriority: 'low' | 'normal' | 'high';
    maxAccountsPerBatch: number;
    parallelEvaluation: boolean;
    compactMode: boolean;
    darkMode: boolean;
}

export interface Account {
    id: string;
    name: string;
    spend: number;
    campaigns: number;
}
