<script setup lang="ts">
import { ref } from 'vue';
import type { Rule, GlobalSettings, NavItem } from '@/types/demo';
import { testRules } from '@/Data/mockData.js';
import AppSidebar from '@/components/demo/AppSidebar.vue';
import RuleBuilderCanvas from '@/components/demo/RuleBuilderCanvas.vue';
import GlobalSettingsPanel from '@/components/demo/GlobalSettingsPanel.vue';

type MockRule = {
    id: number;
    name: string;
    priority: number;
    isActive: boolean;
    conditions: Array<{
        id: string;
        type: string;
        field: string;
        operator: string;
        value: string | number;
        logic?: string;
    }>;
    actions: Array<{
        id: string;
        type: string;
        tags?: string[];
        metadata?: Record<string, unknown>;
        message?: string;
        channel?: string;
    }>;
};

const initialRules: Rule[] = (testRules as MockRule[]).map((r) => ({
    id: String(r.id),
    name: r.name,
    priority: r.priority,
    isActive: r.isActive,
    logic: 'AND' as const,
    conditions: r.conditions.map((c, i) => ({
        id: c.id,
        type: c.type as Rule['conditions'][number]['type'],
        field: c.field,
        operator: c.operator,
        value: c.value,
        logic: (i === 0 ? 'AND' : (c.logic ?? 'AND')) as 'AND' | 'OR',
    })),
    actions: r.actions.map((a) => ({
        id: a.id,
        type: a.type as Rule['actions'][number]['type'],
        ...(a.tags ? { tags: a.tags } : {}),
        ...(a.metadata ? { metadata: a.metadata } : {}),
    })),
}));

const rules = ref<Rule[]>(initialRules);
const currentRuleId = ref<string>(initialRules[0]?.id ?? '');
const currentNav = ref<NavItem>('rules');

const globalSettings = ref<GlobalSettings>({
    currency: 'EUR',
    defaultWindow: '30d',
    aiEnabled: true,
    defaultPriority: 'normal',
    maxAccountsPerBatch: 100,
    parallelEvaluation: false,
    compactMode: false,
    darkMode: true,
});

function addRule(): void {
    const newRule: Rule = {
        id: `rule_${Date.now()}`,
        name: 'New Rule',
        priority: 5,
        isActive: true,
        conditions: [],
        actions: [],
        logic: 'AND',
    };
    rules.value.push(newRule);
    currentRuleId.value = newRule.id;
}

function deleteRule(id: string): void {
    const idx = rules.value.findIndex((r) => r.id === id);
    if (idx === -1) {
        return;
    }
    rules.value.splice(idx, 1);
    if (rules.value.length === 0) {
        addRule();
        return;
    }
    if (currentRuleId.value === id) {
        currentRuleId.value = rules.value[Math.max(0, idx - 1)]?.id ?? '';
    }
}

function duplicateRule(id: string): void {
    const rule = rules.value.find((r) => r.id === id);
    if (!rule) {
        return;
    }
    const copy: Rule = {
        ...JSON.parse(JSON.stringify(rule)),
        id: `rule_${Date.now()}`,
        name: `${rule.name} (copy)`,
    };
    rules.value.push(copy);
    currentRuleId.value = copy.id;
}

function updateRule(updatedRule: Rule): void {
    const idx = rules.value.findIndex((r) => r.id === updatedRule.id);
    if (idx !== -1) {
        rules.value[idx] = updatedRule;
    }
}

function updateSettings(updates: Partial<GlobalSettings>): void {
    Object.assign(globalSettings.value, updates);
}
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-gray-950 font-sans text-gray-100 antialiased">
        <!-- Top header -->
        <header
            class="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between border-b border-gray-800 bg-gray-950/95 px-4 backdrop-blur"
        >
            <div class="flex items-center gap-3">
                <div class="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                    RF
                </div>
                <span class="text-sm font-semibold tracking-wide text-white">RuleForge Meta</span>
                <span
                    class="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400"
                >
                    Demo
                </span>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-600">
                <span class="flex items-center gap-1.5">
                    <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                    All systems operational
                </span>
                <span>·</span>
                <span>{{ rules.filter((r) => r.isActive).length }}/{{ rules.length }} rules active</span>
                <span>·</span>
                <span>{{ globalSettings.currency }} · {{ globalSettings.defaultWindow }}</span>
            </div>
        </header>

        <!-- 3-column layout below header -->
        <div class="flex flex-1 overflow-hidden pt-11">
            <!-- Left: Sidebar -->
            <AppSidebar :current-nav="currentNav" :rules="rules" @navigate="currentNav = $event" />

            <!-- Center: Main content -->
            <RuleBuilderCanvas
                v-if="currentNav === 'rules'"
                :rules="rules"
                :current-rule-id="currentRuleId"
                @select-rule="currentRuleId = $event"
                @add-rule="addRule"
                @delete-rule="deleteRule"
                @duplicate-rule="duplicateRule"
                @update-rule="updateRule"
            />

            <div
                v-else-if="currentNav === 'settings'"
                class="flex flex-1 flex-col overflow-auto bg-gray-950 p-8"
            >
                <div class="mx-auto w-full max-w-lg">
                    <h2 class="mb-1 text-xl font-bold text-white">Global Settings</h2>
                    <p class="mb-6 text-sm text-gray-500">Application-wide configuration for all rules</p>
                    <GlobalSettingsPanel
                        :settings="globalSettings"
                        :full-page="true"
                        @update="updateSettings"
                    />
                </div>
            </div>

            <div v-else class="flex flex-1 flex-col items-center justify-center overflow-auto bg-gray-950">
                <div class="text-center">
                    <div class="mb-4 text-5xl">📚</div>
                    <p class="text-lg font-semibold text-white">Documentation</p>
                    <p class="mt-2 max-w-xs text-sm text-gray-500">
                        Full docs covering rule engine architecture, API reference, and deployment guides coming soon.
                    </p>
                    <button
                        @click="currentNav = 'rules'"
                        class="mt-4 rounded-lg border border-gray-700 px-4 py-2 text-xs text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200"
                    >
                        ← Back to Rules
                    </button>
                </div>
            </div>

            <!-- Right: Global Settings panel (visible alongside rule builder) -->
            <GlobalSettingsPanel
                v-if="currentNav === 'rules'"
                :settings="globalSettings"
                @update="updateSettings"
            />
        </div>
    </div>
</template>
