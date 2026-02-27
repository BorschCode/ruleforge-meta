<script setup lang="ts">
import { computed } from 'vue';
import type { Rule } from '@/types/demo';
import RuleEditor from './RuleEditor.vue';

const props = defineProps<{
    rules: Rule[];
    currentRuleId: string;
}>();

const emit = defineEmits<{
    selectRule: [id: string];
    addRule: [];
    deleteRule: [id: string];
    duplicateRule: [id: string];
    updateRule: [rule: Rule];
}>();

const currentRule = computed(() => props.rules.find((r) => r.id === props.currentRuleId));
</script>

<template>
    <main class="flex flex-1 flex-col overflow-hidden">
        <!-- Rule tabs bar -->
        <div class="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-gray-800 bg-gray-900/70 px-2 py-2">
            <button
                v-for="rule in rules"
                :key="rule.id"
                @click="$emit('selectRule', rule.id)"
                :class="[
                    'group flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                    currentRuleId === rule.id
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300',
                ]"
            >
                <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', rule.isActive ? 'bg-emerald-500' : 'bg-gray-600']"></span>
                <span class="max-w-32 truncate">{{ rule.name }}</span>
                <span
                    v-if="rules.length > 1"
                    @click.stop="$emit('deleteRule', rule.id)"
                    class="hidden shrink-0 rounded p-0.5 text-gray-600 transition-all hover:bg-gray-700 hover:text-gray-400 group-hover:block"
                    title="Close tab"
                >
                    ×
                </span>
            </button>

            <button
                @click="$emit('addRule')"
                class="ml-1 flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-gray-600 transition-all hover:bg-gray-800/50 hover:text-gray-400"
                title="Create new rule"
            >
                <span class="text-sm leading-none">+</span>
                <span>New Rule</span>
            </button>
        </div>

        <!-- Editor -->
        <div class="flex-1 overflow-hidden">
            <RuleEditor
                v-if="currentRule"
                :key="currentRule.id"
                :rule="currentRule"
                @update="$emit('updateRule', $event)"
                @duplicate="$emit('duplicateRule', currentRule.id)"
                @delete="$emit('deleteRule', currentRule.id)"
            />
            <div v-else class="flex h-full flex-col items-center justify-center text-center">
                <p class="mb-3 text-4xl">⚡</p>
                <p class="text-sm font-medium text-gray-400">No rule selected</p>
                <button
                    @click="$emit('addRule')"
                    class="mt-3 rounded-lg border border-blue-500/30 bg-blue-600/15 px-4 py-2 text-xs font-medium text-blue-400 transition-all hover:bg-blue-600/25"
                >
                    Create your first rule
                </button>
            </div>
        </div>
    </main>
</template>
