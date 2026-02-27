<script setup lang="ts">
import type { GlobalSettings } from '@/types/demo';

const props = defineProps<{
    settings: GlobalSettings;
    fullPage?: boolean;
}>();

const emit = defineEmits<{
    update: [settings: Partial<GlobalSettings>];
}>();

function set<K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]): void {
    emit('update', { [key]: value } as Partial<GlobalSettings>);
}
</script>

<template>
    <aside
        :class="[
            'shrink-0 overflow-auto',
            fullPage ? 'w-full rounded-xl border border-gray-700/50 bg-gray-800/30' : 'w-72 border-l border-gray-800 bg-gray-900',
        ]"
    >
        <div class="p-4">
            <h3 class="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Global Settings</h3>

            <!-- General -->
            <section class="mb-6">
                <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">General</p>
                <div class="space-y-4">
                    <!-- Currency -->
                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-gray-400">Currency</label>
                        <div class="flex gap-1">
                            <button
                                v-for="c in ['EUR', 'USD']"
                                :key="c"
                                type="button"
                                @click="set('currency', c as 'EUR' | 'USD')"
                                :class="[
                                    'flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-all',
                                    settings.currency === c
                                        ? 'border-blue-500/50 bg-blue-600/20 text-blue-400'
                                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300',
                                ]"
                            >
                                {{ c }}
                            </button>
                        </div>
                    </div>

                    <!-- Evaluation Window -->
                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-gray-400">Evaluation Window</label>
                        <div class="flex gap-1">
                            <button
                                v-for="w in [
                                    { label: '7 days', value: '7d' },
                                    { label: '30 days', value: '30d' },
                                ]"
                                :key="w.value"
                                type="button"
                                @click="set('defaultWindow', w.value as '7d' | '30d')"
                                :class="[
                                    'flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-all',
                                    settings.defaultWindow === w.value
                                        ? 'border-blue-500/50 bg-blue-600/20 text-blue-400'
                                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300',
                                ]"
                            >
                                {{ w.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Default Priority -->
                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-gray-400">Default Priority</label>
                        <select
                            :value="settings.defaultPriority"
                            @change="set('defaultPriority', ($event.target as HTMLSelectElement).value as 'low' | 'normal' | 'high')"
                            class="w-full rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <!-- AI Analysis toggle -->
                    <label class="flex cursor-pointer items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-300">Enable AI Analysis</p>
                            <p class="mt-0.5 text-[10px] text-gray-600">Auto-flag high-risk accounts</p>
                        </div>
                        <button
                            type="button"
                            @click="set('aiEnabled', !settings.aiEnabled)"
                            :class="['relative h-5 w-9 rounded-full transition-colors', settings.aiEnabled ? 'bg-blue-600' : 'bg-gray-700']"
                        >
                            <span
                                :class="[
                                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                    settings.aiEnabled ? 'translate-x-4' : 'translate-x-0.5',
                                ]"
                            ></span>
                        </button>
                    </label>
                </div>
            </section>

            <!-- Performance -->
            <section class="mb-6">
                <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Performance</p>
                <div class="space-y-4">
                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-gray-400">Max Accounts Per Batch</label>
                        <input
                            type="number"
                            :value="settings.maxAccountsPerBatch"
                            @change="set('maxAccountsPerBatch', Number(($event.target as HTMLInputElement).value))"
                            min="10"
                            max="1000"
                            step="10"
                            class="w-full rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <label class="flex cursor-pointer items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-300">Parallel Evaluation</p>
                            <p class="mt-0.5 text-[10px] text-gray-600">Run rules concurrently</p>
                        </div>
                        <button
                            type="button"
                            @click="set('parallelEvaluation', !settings.parallelEvaluation)"
                            :class="[
                                'relative h-5 w-9 rounded-full transition-colors',
                                settings.parallelEvaluation ? 'bg-blue-600' : 'bg-gray-700',
                            ]"
                        >
                            <span
                                :class="[
                                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                    settings.parallelEvaluation ? 'translate-x-4' : 'translate-x-0.5',
                                ]"
                            ></span>
                        </button>
                    </label>
                </div>
            </section>

            <!-- UI -->
            <section>
                <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Interface</p>
                <div class="space-y-4">
                    <label class="flex cursor-pointer items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-300">Compact Mode</p>
                            <p class="mt-0.5 text-[10px] text-gray-600">Reduce spacing</p>
                        </div>
                        <button
                            type="button"
                            @click="set('compactMode', !settings.compactMode)"
                            :class="['relative h-5 w-9 rounded-full transition-colors', settings.compactMode ? 'bg-blue-600' : 'bg-gray-700']"
                        >
                            <span
                                :class="[
                                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                    settings.compactMode ? 'translate-x-4' : 'translate-x-0.5',
                                ]"
                            ></span>
                        </button>
                    </label>

                    <label class="flex cursor-pointer items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-300">Dark Mode</p>
                            <p class="mt-0.5 text-[10px] text-gray-600">System-wide dark theme</p>
                        </div>
                        <button
                            type="button"
                            @click="set('darkMode', !settings.darkMode)"
                            :class="['relative h-5 w-9 rounded-full transition-colors', settings.darkMode ? 'bg-blue-600' : 'bg-gray-700']"
                        >
                            <span
                                :class="[
                                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                    settings.darkMode ? 'translate-x-4' : 'translate-x-0.5',
                                ]"
                            ></span>
                        </button>
                    </label>
                </div>
            </section>
        </div>
    </aside>
</template>
