<script setup lang="ts">
import type { NavItem, Rule } from '@/types/demo';

defineProps<{
    currentNav: NavItem;
    rules: Rule[];
}>();

defineEmits<{
    navigate: [nav: NavItem];
}>();

const navItems: Array<{ id: NavItem; label: string; icon: string; desc: string }> = [
    { id: 'rules', label: 'Rules', icon: '⚡', desc: 'Rule builder' },
    { id: 'settings', label: 'Global Settings', icon: '⚙️', desc: 'Configuration' },
    { id: 'docs', label: 'Documentation', icon: '📚', desc: 'Guides & API' },
];
</script>

<template>
    <aside class="flex w-56 shrink-0 flex-col overflow-hidden border-r border-gray-800 bg-gray-900">
        <!-- User section -->
        <div class="border-b border-gray-800 p-4">
            <div class="mb-3 flex items-center gap-3">
                <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white"
                >
                    JD
                </div>
                <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-white">John Doe</p>
                    <p class="truncate text-xs text-blue-400">Super Admin</p>
                </div>
            </div>
            <div class="space-y-1.5 text-xs">
                <div class="flex items-center gap-2">
                    <span class="text-gray-600">Org:</span>
                    <span class="text-gray-400">Meta Operations</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-gray-600">Env:</span>
                    <span
                        class="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                        Demo
                    </span>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 p-3">
            <p class="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Navigation</p>
            <button
                v-for="item in navItems"
                :key="item.id"
                @click="$emit('navigate', item.id)"
                :class="[
                    'group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all',
                    currentNav === item.id
                        ? 'border-blue-500/20 bg-blue-600/15 text-blue-400'
                        : 'border-transparent text-gray-400 hover:bg-gray-800/60 hover:text-gray-200',
                ]"
            >
                <span class="text-base leading-none">{{ item.icon }}</span>
                <div class="min-w-0">
                    <p class="text-xs font-medium leading-none">{{ item.label }}</p>
                    <p class="mt-1 text-[10px] leading-none text-gray-600">{{ item.desc }}</p>
                </div>
            </button>
        </nav>

        <!-- Stats footer -->
        <div class="space-y-1.5 border-t border-gray-800 p-3">
            <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">Active rules</span>
                <span class="font-semibold text-emerald-400">{{ rules.filter((r) => r.isActive).length }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">Total rules</span>
                <span class="font-semibold text-gray-300">{{ rules.length }}</span>
            </div>
            <p class="pt-1 text-center text-[10px] text-gray-700">RuleForge Meta v1.0</p>
        </div>
    </aside>
</template>
