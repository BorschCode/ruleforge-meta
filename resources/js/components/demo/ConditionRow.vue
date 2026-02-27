<script setup lang="ts">
import { computed } from 'vue';
import type { Condition, LogicOperator } from '@/types/demo';
import { conditionBlocks } from '@/Data/mockData.js';

const props = defineProps<{
    condition: Condition;
    index: number;
    showLogicBefore: boolean;
    isDragOver: boolean;
}>();

const emit = defineEmits<{
    update: [updates: Partial<Condition>];
    remove: [];
    logicToggle: [];
    dragStart: [event: DragEvent];
    dragEnd: [];
    dragOver: [event: DragEvent];
    drop: [event: DragEvent];
}>();

const blockDef = computed(() => conditionBlocks.find((b: { type: string }) => b.type === props.condition.type));

const colors = computed(() => {
    const map: Record<string, { bg: string; border: string; badgeBg: string; badgeText: string }> = {
        spend: {
            bg: 'bg-emerald-500/5',
            border: 'border-emerald-500/20',
            badgeBg: 'bg-emerald-500/15',
            badgeText: 'text-emerald-400',
        },
        count: {
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            badgeBg: 'bg-blue-500/15',
            badgeText: 'text-blue-400',
        },
        client: {
            bg: 'bg-violet-500/5',
            border: 'border-violet-500/20',
            badgeBg: 'bg-violet-500/15',
            badgeText: 'text-violet-400',
        },
        date: {
            bg: 'bg-orange-500/5',
            border: 'border-orange-500/20',
            badgeBg: 'bg-orange-500/15',
            badgeText: 'text-orange-400',
        },
        tag: {
            bg: 'bg-pink-500/5',
            border: 'border-pink-500/20',
            badgeBg: 'bg-pink-500/15',
            badgeText: 'text-pink-400',
        },
    };
    return map[props.condition.type] ?? map['spend'];
});

function onFieldChange(event: Event): void {
    emit('update', { field: (event.target as HTMLSelectElement).value });
}

function onOperatorChange(event: Event): void {
    emit('update', { operator: (event.target as HTMLSelectElement).value });
}

function onValueInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const isNumeric = ['spend', 'count'].includes(props.condition.type);
    emit('update', { value: isNumeric ? Number(raw) : raw });
}
</script>

<template>
    <div>
        <!-- Logic connector badge shown before all conditions except the first -->
        <div v-if="showLogicBefore" class="flex items-center gap-2 py-1.5 pl-6">
            <div class="h-px w-4 bg-gray-800"></div>
            <button
                type="button"
                @click="$emit('logicToggle')"
                :class="[
                    'rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                    condition.logic === 'AND'
                        ? 'border-blue-500/30 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                        : 'border-orange-500/30 bg-orange-600/20 text-orange-400 hover:bg-orange-600/30',
                ]"
            >
                {{ condition.logic }}
            </button>
            <div class="h-px flex-1 bg-gray-800"></div>
        </div>

        <!-- Condition card -->
        <div
            :class="[
                'group flex items-start gap-2 rounded-lg border p-3 transition-all',
                colors.bg,
                colors.border,
                isDragOver ? 'scale-[1.01] border-blue-400/50 bg-blue-500/10' : '',
            ]"
            @dragover.prevent="$emit('dragOver', $event)"
            @drop.prevent.stop="$emit('drop', $event)"
        >
            <!-- Drag handle -->
            <div
                draggable="true"
                @dragstart="$emit('dragStart', $event)"
                @dragend="$emit('dragEnd')"
                class="mt-0.5 cursor-grab select-none text-sm leading-none text-gray-700 hover:text-gray-500 active:cursor-grabbing"
                title="Drag to reorder"
            >
                ⠿
            </div>

            <!-- Inputs row -->
            <div class="flex flex-1 flex-wrap items-center gap-2">
                <!-- Type badge -->
                <span :class="['shrink-0 rounded px-2 py-0.5 text-xs font-semibold', colors.badgeBg, colors.badgeText]">
                    {{ blockDef?.icon }} {{ blockDef?.label }}
                </span>

                <!-- Field selector -->
                <select
                    :value="condition.field"
                    @change="onFieldChange($event)"
                    class="rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-blue-500/50 focus:outline-none"
                >
                    <option v-for="f in blockDef?.fields" :key="f.value" :value="f.value">{{ f.label }}</option>
                </select>

                <!-- Operator selector -->
                <select
                    :value="condition.operator"
                    @change="onOperatorChange($event)"
                    class="rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-blue-500/50 focus:outline-none"
                >
                    <option v-for="op in blockDef?.operators" :key="op.value" :value="op.value">{{ op.label }}</option>
                </select>

                <!-- Value: numeric -->
                <input
                    v-if="['spend', 'count'].includes(condition.type)"
                    type="number"
                    :value="condition.value"
                    @input="onValueInput($event)"
                    class="w-24 rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-blue-500/50 focus:outline-none"
                    placeholder="Value"
                />
                <!-- Value: date -->
                <input
                    v-else-if="condition.type === 'date'"
                    type="date"
                    :value="condition.value"
                    @input="onValueInput($event)"
                    class="rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-orange-500/50 focus:outline-none"
                />
                <!-- Value: text -->
                <input
                    v-else
                    type="text"
                    :value="condition.value"
                    @input="onValueInput($event)"
                    class="min-w-20 flex-1 rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-violet-500/50 focus:outline-none"
                    placeholder="Value..."
                />
            </div>

            <!-- Remove -->
            <button
                type="button"
                @click="$emit('remove')"
                class="mt-0.5 shrink-0 rounded p-1 text-gray-700 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                title="Remove condition"
            >
                ×
            </button>
        </div>
    </div>
</template>
