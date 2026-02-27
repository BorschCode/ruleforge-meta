import type { Rule, Condition, Account } from '@/types/demo';
import { sampleAccounts } from '@/Data/mockData.js';

function compareNumbers(a: number, operator: string, b: number): boolean {
    switch (operator) {
        case '>':
            return a > b;
        case '>=':
            return a >= b;
        case '<':
            return a < b;
        case '<=':
            return a <= b;
        case '=':
            return a === b;
        case '!=':
            return a !== b;
        default:
            return true;
    }
}

function compareStrings(a: string, operator: string, b: string): boolean {
    const la = a.toLowerCase();
    const lb = b.toLowerCase();
    switch (operator) {
        case 'contains':
            return la.includes(lb);
        case 'equals':
            return la === lb;
        case 'starts_with':
            return la.startsWith(lb);
        case 'ends_with':
            return la.endsWith(lb);
        default:
            return true;
    }
}

function evaluateCondition(condition: Condition, account: Account): boolean {
    switch (condition.type) {
        case 'spend':
            return compareNumbers(account.spend, condition.operator, Number(condition.value));
        case 'count':
            return compareNumbers(account.campaigns, condition.operator, Number(condition.value));
        case 'client':
            return compareStrings(account.name, condition.operator, String(condition.value));
        case 'date':
        case 'tag':
            return true;
        default:
            return true;
    }
}

export function simulateRule(rule: Rule): number {
    if (rule.conditions.length === 0) {
        return 0;
    }

    const accounts = sampleAccounts as Account[];
    const matched = accounts.filter((account) => {
        const results = rule.conditions.map((cond) => evaluateCondition(cond, account));
        return rule.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
    });

    const matchRate = matched.length / accounts.length;
    return Math.round(matchRate * 2500);
}

export function getMatchedSampleAccounts(rule: Rule): Account[] {
    if (rule.conditions.length === 0) {
        return [];
    }

    const accounts = sampleAccounts as Account[];
    return accounts.filter((account) => {
        const results = rule.conditions.map((cond) => evaluateCondition(cond, account));
        return rule.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
    });
}
