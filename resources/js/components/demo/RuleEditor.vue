<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Rule, Condition, Action, ConditionType, ActionType, LogicOperator } from '@/types/demo';
import { conditionBlocks, actionBlocks } from '@/Data/mockData.js';
import { simulateRule, getMatchedSampleAccounts } from '@/composables/useRuleSimulator';
import ConditionRow from './ConditionRow.vue';
import ActionRow from './ActionRow.vue';

const props = defineProps<{
    rule: Rule;
}>();

const emit = defineEmits<{
    update: [rule: Rule];
    duplicate: [];
    delete: [];
}>();

const localRule = ref<Rule>(JSON.parse(JSON.stringify(props.rule)));
const showSampleAccounts = ref(false);

watch(
    () => props.rule,
    (newRule) => {
        localRule.value = JSON.parse(JSON.stringify(newRule));
    },
    { deep: true },
);

function emitUpdate(): void {
    emit('update', JSON.parse(JSON.stringify(localRule.value)));
}

function setField<K extends keyof Rule>(key: K, value: Rule[K]): void {
    (localRule.value as Record<string, unknown>)[key] = value;
    emitUpdate();
}

// --- Conditions ---

function addCondition(type: ConditionType): void {
    const blockDef = conditionBlocks.find((b: { type: string }) => b.type === type);
    if (!blockDef) {
        return;
    }
    const newCond: Condition = {
        id: `cond_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        field: blockDef.fields[0].value,
        operator: blockDef.operators[0].value,
        value: ['spend', 'count'].includes(type) ? 1000 : '',
        logic: 'AND',
    };
    localRule.value.conditions.push(newCond);
    emitUpdate();
}

function removeCondition(index: number): void {
    localRule.value.conditions.splice(index, 1);
    emitUpdate();
}

function updateCondition(index: number, updates: Partial<Condition>): void {
    Object.assign(localRule.value.conditions[index], updates);
    emitUpdate();
}

function toggleConditionLogic(index: number): void {
    const cond = localRule.value.conditions[index];
    cond.logic = cond.logic === 'AND' ? 'OR' : 'AND';
    emitUpdate();
}

// --- Actions ---

function addAction(type: ActionType): void {
    const newAction: Action = {
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        ...(type === 'add_tag' ? { tags: [] } : {}),
        ...(type === 'set_metadata' ? { metadata: { priority: 'normal', ai_analysis_enabled: false } } : {}),
        ...(type === 'notify' ? { message: '', channel: 'email' } : {}),
    };
    localRule.value.actions.push(newAction);
    emitUpdate();
}

function removeAction(index: number): void {
    localRule.value.actions.splice(index, 1);
    emitUpdate();
}

function updateAction(index: number, updates: Partial<Action>): void {
    Object.assign(localRule.value.actions[index], updates);
    emitUpdate();
}

// --- Drag and Drop ---

const isDragOverConditions = ref(false);
const isDragOverActions = ref(false);
const dragOverConditionIndex = ref(-1);
const dragOverActionIndex = ref(-1);

function onPaletteDragStart(event: DragEvent, type: string, section: 'condition' | 'action'): void {
    if (!event.dataTransfer) {
        return;
    }
    event.dataTransfer.setData('blockType', type);
    event.dataTransfer.setData('section', section);
    event.dataTransfer.setData('source', 'palette');
    event.dataTransfer.effectAllowed = 'copy';
}

function onConditionRowDragStart(event: DragEvent, index: number): void {
    if (!event.dataTransfer) {
        return;
    }
    event.dataTransfer.setData('source', 'condition-row');
    event.dataTransfer.setData('rowIndex', String(index));
    event.dataTransfer.effectAllowed = 'move';
}

function onConditionRowDrop(event: DragEvent, targetIndex: number): void {
    dragOverConditionIndex.value = -1;
    const source = event.dataTransfer?.getData('source');
    if (source === 'condition-row') {
        const fromIndex = parseInt(event.dataTransfer?.getData('rowIndex') ?? '-1');
        if (fromIndex >= 0 && fromIndex !== targetIndex) {
            const [moved] = localRule.value.conditions.splice(fromIndex, 1);
            localRule.value.conditions.splice(targetIndex, 0, moved);
            emitUpdate();
        }
    } else if (source === 'palette' && event.dataTransfer?.getData('section') === 'condition') {
        const blockType = event.dataTransfer?.getData('blockType');
        if (blockType) {
            addCondition(blockType as ConditionType);
        }
    }
}

function onConditionsZoneDrop(event: DragEvent): void {
    isDragOverConditions.value = false;
    const source = event.dataTransfer?.getData('source');
    if (source === 'palette' && event.dataTransfer?.getData('section') === 'condition') {
        const blockType = event.dataTransfer?.getData('blockType');
        if (blockType) {
            addCondition(blockType as ConditionType);
        }
    }
}

function onActionRowDragStart(event: DragEvent, index: number): void {
    if (!event.dataTransfer) {
        return;
    }
    event.dataTransfer.setData('source', 'action-row');
    event.dataTransfer.setData('rowIndex', String(index));
    event.dataTransfer.effectAllowed = 'move';
}

function onActionRowDrop(event: DragEvent, targetIndex: number): void {
    dragOverActionIndex.value = -1;
    const source = event.dataTransfer?.getData('source');
    if (source === 'action-row') {
        const fromIndex = parseInt(event.dataTransfer?.getData('rowIndex') ?? '-1');
        if (fromIndex >= 0 && fromIndex !== targetIndex) {
            const [moved] = localRule.value.actions.splice(fromIndex, 1);
            localRule.value.actions.splice(targetIndex, 0, moved);
            emitUpdate();
        }
    } else if (source === 'palette' && event.dataTransfer?.getData('section') === 'action') {
        const blockType = event.dataTransfer?.getData('blockType');
        if (blockType) {
            addAction(blockType as ActionType);
        }
    }
}

function onActionsZoneDrop(event: DragEvent): void {
    isDragOverActions.value = false;
    const source = event.dataTransfer?.getData('source');
    if (source === 'palette' && event.dataTransfer?.getData('section') === 'action') {
        const blockType = event.dataTransfer?.getData('blockType');
        if (blockType) {
            addAction(blockType as ActionType);
        }
    }
}

// --- Preview ---

const matchedCount = computed(() => simulateRule(localRule.value));
const matchedSamples = computed(() => getMatchedSampleAccounts(localRule.value));
</script>

<template>
    <div class="flex h-full flex-col overflow-hidden bg-gray-950">
        <!-- Rule header -->
        <div class="shrink-0 border-b border-gray-800 bg-gray-900/50 px-5 py-4">
            <div class="mb-3 flex items-center gap-3">
                <input
                    :value="localRule.name"
                    @input="setField('name', ($event.target as HTMLInputElement).value)"
                    class="flex-1 border-b border-transparent bg-transparent text-lg font-semibold text-white placeholder-gray-700 focus:border-gray-700 focus:outline-none"
                    placeholder="Rule name..."
                />

                <!-- Active toggle -->
                <label class="flex cursor-pointer items-center gap-2">
                    <span :class="['text-xs', localRule.isActive ? 'text-emerald-400' : 'text-gray-600']">
                        {{ localRule.isActive ? 'Active' : 'Inactive' }}
                    </span>
                    <button
                        type="button"
                        @click="setField('isActive', !localRule.isActive)"
                        :class="[
                            'relative h-5 w-9 rounded-full transition-colors',
                            localRule.isActive ? 'bg-emerald-600' : 'bg-gray-700',
                        ]"
                    >
                        <span
                            :class="[
                                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                localRule.isActive ? 'translate-x-4' : 'translate-x-0.5',
                            ]"
                        ></span>
                    </button>
                </label>

                <button
                    type="button"
                    @click="$emit('duplicate')"
                    class="rounded-md border border-gray-700 px-2.5 py-1 text-xs text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200"
                >
                    Duplicate
                </button>
                <button
                    type="button"
                    @click="$emit('delete')"
                    class="rounded-md border border-red-900/50 px-2.5 py-1 text-xs text-red-500 transition-all hover:border-red-800 hover:bg-red-900/20"
                >
                    Delete
                </button>
            </div>

            <div class="flex items-center gap-5 text-xs">
                <div class="flex items-center gap-2">
                    <span class="text-gray-600">Priority:</span>
                    <input
                        type="number"
                        :value="localRule.priority"
                        @input="setField('priority', Number(($event.target as HTMLInputElement).value))"
                        min="1"
                        max="10"
                        class="w-12 rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-center text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div class="flex items-center gap-2">
                    <span class="text-gray-600">Evaluate with:</span>
                    <div class="flex gap-1">
                        <button
                            v-for="op in (['AND', 'OR'] as LogicOperator[])"
                            :key="op"
                            type="button"
                            @click="setField('logic', op)"
                            :class="[
                                'rounded px-2.5 py-0.5 text-xs font-bold transition-all',
                                localRule.logic === op
                                    ? op === 'AND'
                                        ? 'border border-blue-500/30 bg-blue-600/25 text-blue-400'
                                        : 'border border-orange-500/30 bg-orange-600/25 text-orange-400'
                                    : 'border border-gray-700 text-gray-600 hover:text-gray-400',
                            ]"
                        >
                            {{ op }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scrollable content -->
        <div class="flex-1 space-y-6 overflow-auto px-5 py-4">
            <!-- CONDITIONS -->
            <section>
                <div class="mb-3 flex items-center justify-between">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-500">Conditions</h3>
                    <span class="text-xs text-gray-700">
                        {{ localRule.conditions.length }}
                        {{ localRule.conditions.length === 1 ? 'condition' : 'conditions' }}
                    </span>
                </div>

                <!-- Condition palette -->
                <div class="mb-3 flex flex-wrap gap-1.5">
                    <button
                        v-for="block in conditionBlocks"
                        :key="block.type"
                        type="button"
                        draggable="true"
                        @dragstart="onPaletteDragStart($event, block.type, 'condition')"
                        @click="addCondition(block.type as ConditionType)"
                        class="flex cursor-grab items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800/80 px-3 py-1 text-xs text-gray-400 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-gray-200 active:scale-95 active:cursor-grabbing"
                        :title="`Click or drag to add ${block.label} condition`"
                    >
                        <span>{{ block.icon }}</span>
                        <span class="font-medium">{{ block.label }}</span>
                        <span class="text-gray-600">+</span>
                    </button>
                </div>

                <!-- Drop zone -->
                <div
                    :class="[
                        'min-h-14 rounded-xl border-2 border-dashed transition-all',
                        isDragOverConditions
                            ? 'border-blue-500/60 bg-blue-500/5'
                            : localRule.conditions.length === 0
                              ? 'border-gray-800'
                              : 'border-transparent',
                    ]"
                    @dragover.prevent="isDragOverConditions = true"
                    @dragleave="isDragOverConditions = false"
                    @drop.prevent="onConditionsZoneDrop($event)"
                >
                    <div v-if="localRule.conditions.length === 0" class="flex h-14 items-center justify-center">
                        <p class="text-xs text-gray-700">Drop a condition block here, or click one above to add it</p>
                    </div>
                    <div v-else class="space-y-1">
                        <ConditionRow
                            v-for="(condition, i) in localRule.conditions"
                            :key="condition.id"
                            :condition="condition"
                            :index="i"
                            :show-logic-before="i > 0"
                            :is-drag-over="dragOverConditionIndex === i"
                            @update="updateCondition(i, $event)"
                            @remove="removeCondition(i)"
                            @logic-toggle="toggleConditionLogic(i)"
                            @drag-start="onConditionRowDragStart($event, i)"
                            @drag-end="dragOverConditionIndex = -1"
                            @drag-over="dragOverConditionIndex = i"
                            @drop="onConditionRowDrop($event, i)"
                        />
                    </div>
                </div>
            </section>

            <!-- ACTIONS -->
            <section>
                <div class="mb-3 flex items-center justify-between">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-500">Actions</h3>
                    <span class="text-xs text-gray-700">
                        {{ localRule.actions.length }}
                        {{ localRule.actions.length === 1 ? 'action' : 'actions' }}
                    </span>
                </div>

                <!-- Action palette -->
                <div class="mb-3 flex flex-wrap gap-1.5">
                    <button
                        v-for="block in actionBlocks"
                        :key="block.type"
                        type="button"
                        draggable="true"
                        @dragstart="onPaletteDragStart($event, block.type, 'action')"
                        @click="addAction(block.type as ActionType)"
                        class="flex cursor-grab items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800/80 px-3 py-1 text-xs text-gray-400 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-gray-200 active:scale-95 active:cursor-grabbing"
                        :title="`Click or drag to add ${block.label} action`"
                    >
                        <span>{{ block.icon }}</span>
                        <span class="font-medium">{{ block.label }}</span>
                        <span class="text-gray-600">+</span>
                    </button>
                </div>

                <!-- Drop zone -->
                <div
                    :class="[
                        'min-h-14 rounded-xl border-2 border-dashed transition-all',
                        isDragOverActions
                            ? 'border-blue-500/60 bg-blue-500/5'
                            : localRule.actions.length === 0
                              ? 'border-gray-800'
                              : 'border-transparent',
                    ]"
                    @dragover.prevent="isDragOverActions = true"
                    @dragleave="isDragOverActions = false"
                    @drop.prevent="onActionsZoneDrop($event)"
                >
                    <div v-if="localRule.actions.length === 0" class="flex h-14 items-center justify-center">
                        <p class="text-xs text-gray-700">Drop an action block here, or click one above to add it</p>
                    </div>
                    <div v-else class="space-y-2">
                        <ActionRow
                            v-for="(action, i) in localRule.actions"
                            :key="action.id"
                            :action="action"
                            :index="i"
                            :is-drag-over="dragOverActionIndex === i"
                            @update="updateAction(i, $event)"
                            @remove="removeAction(i)"
                            @drag-start="onActionRowDragStart($event, i)"
                            @drag-end="dragOverActionIndex = -1"
                            @drag-over="dragOverActionIndex = i"
                            @drop="onActionRowDrop($event, i)"
                        />
                    </div>
                </div>
            </section>
        </div>

        <!-- Preview bar -->
        <div class="shrink-0 border-t border-gray-800 bg-gray-900/50 px-5 py-3">
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span class="text-xs text-gray-600">Simulation</span>

                    <div class="text-sm">
                        <span v-if="localRule.conditions.length === 0" class="text-gray-700">
                            Add conditions to see a preview
                        </span>
                        <span v-else>
                            <span class="font-bold text-white">~{{ matchedCount.toLocaleString() }}</span>
                            <span class="ml-1.5 text-gray-500">estimated matched accounts</span>
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <button
                        v-if="localRule.conditions.length > 0"
                        type="button"
                        @click="showSampleAccounts = !showSampleAccounts"
                        class="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        {{ showSampleAccounts ? 'Hide' : 'Show' }} sample matches ({{ matchedSamples.length }}/5)
                    </button>
                    <span
                        :class="[
                            'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                            localRule.logic === 'AND'
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'bg-orange-600/20 text-orange-400',
                        ]"
                    >
                        {{ localRule.conditions.length }} cond · {{ localRule.logic }}
                    </span>
                    <span class="text-xs text-gray-600">{{ localRule.actions.length }} action{{ localRule.actions.length !== 1 ? 's' : '' }}</span>
                </div>
            </div>

            <!-- Sample accounts preview -->
            <div v-if="showSampleAccounts && matchedSamples.length > 0" class="mt-3 space-y-1">
                <p class="text-[10px] uppercase tracking-wider text-gray-700">Matched sample accounts</p>
                <div
                    v-for="account in matchedSamples"
                    :key="account.id"
                    class="flex items-center justify-between rounded-md bg-gray-800/50 px-3 py-1.5 text-xs"
                >
                    <span class="text-gray-300">{{ account.name }}</span>
                    <div class="flex items-center gap-3 text-gray-500">
                        <span>€{{ account.spend.toLocaleString() }}</span>
                        <span>{{ account.campaigns }} campaigns</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
