<script setup lang="ts">
import { computed } from 'vue';
import type { Action } from '@/types/demo';
import { availableTags } from '@/Data/mockData.js';

const props = defineProps<{
    action: Action;
    index: number;
    isDragOver: boolean;
}>();

const emit = defineEmits<{
    update: [updates: Partial<Action>];
    remove: [];
    dragStart: [event: DragEvent];
    dragEnd: [];
    dragOver: [event: DragEvent];
    drop: [event: DragEvent];
}>();

const typeConfig = computed(() => {
    const map: Record<string, { label: string; icon: string; bg: string; border: string; badgeBg: string; badgeText: string }> = {
        add_tag: {
            label: 'Add Tags',
            icon: '🏷️',
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            badgeBg: 'bg-blue-500/15',
            badgeText: 'text-blue-400',
        },
        set_metadata: {
            label: 'Set Metadata',
            icon: '⚙️',
            bg: 'bg-slate-500/5',
            border: 'border-slate-500/20',
            badgeBg: 'bg-slate-500/15',
            badgeText: 'text-slate-400',
        },
        notify: {
            label: 'Send Notification',
            icon: '📧',
            bg: 'bg-amber-500/5',
            border: 'border-amber-500/20',
            badgeBg: 'bg-amber-500/15',
            badgeText: 'text-amber-400',
        },
        trigger: {
            label: 'Trigger Action',
            icon: '🚀',
            bg: 'bg-red-500/5',
            border: 'border-red-500/20',
            badgeBg: 'bg-red-500/15',
            badgeText: 'text-red-400',
        },
    };
    return map[props.action.type] ?? map['add_tag'];
});

const tagInputValue = computed(() => (props.action.tags ?? []).join(', '));

function updateTagsFromInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const tags = val
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    emit('update', { tags });
}

function addTagSuggestion(tagName: string): void {
    const currentTags = props.action.tags ?? [];
    if (!currentTags.includes(tagName)) {
        emit('update', { tags: [...currentTags, tagName] });
    }
}

function getMetadata(key: string): unknown {
    return (props.action.metadata ?? {})[key];
}

function updateMetadata(key: string, value: unknown): void {
    emit('update', { metadata: { ...(props.action.metadata ?? {}), [key]: value } });
}
</script>

<template>
    <div
        :class="[
            'group flex items-start gap-2 rounded-lg border p-3 transition-all',
            typeConfig.bg,
            typeConfig.border,
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

        <!-- Content -->
        <div class="flex flex-1 flex-wrap items-start gap-2">
            <!-- Type badge -->
            <span :class="['shrink-0 rounded px-2 py-0.5 text-xs font-semibold', typeConfig.badgeBg, typeConfig.badgeText]">
                {{ typeConfig.icon }} {{ typeConfig.label }}
            </span>

            <!-- add_tag -->
            <template v-if="action.type === 'add_tag'">
                <div class="min-w-48 flex-1">
                    <input
                        type="text"
                        :value="tagInputValue"
                        @input="updateTagsFromInput($event)"
                        placeholder="tag1, tag2, ..."
                        class="w-full rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-blue-500/50 focus:outline-none"
                    />
                    <div class="mt-1.5 flex flex-wrap gap-1">
                        <button
                            v-for="tag in (availableTags as Array<{ id: number; name: string; color: string }>).slice(0, 5)"
                            :key="tag.id"
                            type="button"
                            @click="addTagSuggestion(tag.name)"
                            class="rounded-full border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                        >
                            + {{ tag.name }}
                        </button>
                    </div>
                </div>
            </template>

            <!-- set_metadata -->
            <template v-else-if="action.type === 'set_metadata'">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs text-gray-500">Priority:</span>
                        <select
                            :value="String(getMetadata('priority') ?? 'normal')"
                            @change="updateMetadata('priority', ($event.target as HTMLSelectElement).value)"
                            class="rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <label class="flex cursor-pointer items-center gap-1.5">
                        <input
                            type="checkbox"
                            :checked="Boolean(getMetadata('ai_analysis_enabled'))"
                            @change="updateMetadata('ai_analysis_enabled', ($event.target as HTMLInputElement).checked)"
                            class="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-xs text-gray-400">AI Analysis</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-1.5">
                        <input
                            type="checkbox"
                            :checked="Boolean(getMetadata('smm_boost_enabled'))"
                            @change="updateMetadata('smm_boost_enabled', ($event.target as HTMLInputElement).checked)"
                            class="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-xs text-gray-400">SMM Boost</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-1.5">
                        <input
                            type="checkbox"
                            :checked="Boolean(getMetadata('skip_sync'))"
                            @change="updateMetadata('skip_sync', ($event.target as HTMLInputElement).checked)"
                            class="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-xs text-gray-400">Skip Sync</span>
                    </label>
                </div>
            </template>

            <!-- notify -->
            <template v-else-if="action.type === 'notify'">
                <div class="flex flex-1 flex-wrap items-center gap-2">
                    <input
                        type="text"
                        :value="action.message ?? ''"
                        @input="$emit('update', { message: ($event.target as HTMLInputElement).value })"
                        placeholder="Notification message..."
                        class="min-w-40 flex-1 rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-amber-500/50 focus:outline-none"
                    />
                    <select
                        :value="action.channel ?? 'email'"
                        @change="$emit('update', { channel: ($event.target as HTMLSelectElement).value })"
                        class="rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:outline-none"
                    >
                        <option value="email">Email</option>
                        <option value="webhook">Webhook</option>
                        <option value="internal">Internal Alert</option>
                    </select>
                </div>
            </template>

            <!-- trigger -->
            <template v-else>
                <div class="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Downstream workflow name..."
                        class="min-w-48 rounded border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-300 focus:border-red-500/50 focus:outline-none"
                    />
                    <span class="text-[10px] italic text-gray-600">mock — no side effects</span>
                </div>
            </template>
        </div>

        <!-- Remove -->
        <button
            type="button"
            @click="$emit('remove')"
            class="mt-0.5 shrink-0 rounded p-1 text-gray-700 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
            title="Remove action"
        >
            ×
        </button>
    </div>
</template>
