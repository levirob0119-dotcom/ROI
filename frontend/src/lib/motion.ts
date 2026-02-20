/**
 * Framer Motion 动效预设
 * 设计架构重构 - Vercel + Raycast + Linear 融合
 */

import type { Transition, Variants } from 'framer-motion';

// ========================================
// 过渡曲线
// ========================================
export const easings = {
    smooth: [0.16, 1, 0.3, 1] as const,       // Vercel 默认
    bounce: [0.34, 1.56, 0.64, 1] as const,   // 弹性
    snap: [0.65, 0, 0.35, 1] as const,        // 快速
    easeOut: [0, 0, 0.2, 1] as const,         // 标准
};

// ========================================
// 过渡预设
// ========================================
export const transitions = {
    fast: { duration: 0.1, ease: easings.smooth } as Transition,
    normal: { duration: 0.2, ease: easings.smooth } as Transition,
    slow: { duration: 0.3, ease: easings.smooth } as Transition,
    spring: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
    springBounce: { type: 'spring', stiffness: 300, damping: 20 } as Transition,
    expand: { type: 'spring', stiffness: 200, damping: 25 } as Transition,
};

// Design system spring presets
export const microSpring: Transition = { type: 'spring', stiffness: 400, damping: 25 };
export const componentSpring: Transition = { type: 'spring', stiffness: 260, damping: 20 };
export const pageSpring: Transition = { type: 'spring', stiffness: 100, damping: 20 };
export const reducedMotionTransition: Transition = { duration: 0.01, ease: 'linear' };

// ========================================
// 页面进入动效 - Linear 风格 Stagger
// ========================================
export const pageTransition = {
    container: {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.06,
                delayChildren: 0.1,
            },
        },
    } as Variants,

    item: {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: easings.smooth }
        },
    } as Variants,
};

// ========================================
// 卡片动效
// ========================================
export const variants = {
    // 基础卡片悬浮
    hoverLift: {
        initial: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
        hover: {
            y: -4,
            boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
            transition: transitions.normal
        },
    } as Variants,

    // NIO 发光边框卡片
    cardGlow: {
        initial: {
            y: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        },
        hover: {
            y: -4,
            boxShadow: '0 0 0 1px rgba(78,146,249,0.15), 0 12px 32px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.04)',
            transition: transitions.normal
        },
    } as Variants,

    // 按钮按压
    pressScale: {
        initial: { scale: 1 },
        tap: { scale: 0.97, transition: transitions.fast },
    } as Variants,

    // 按钮悬浮
    buttonHover: {
        initial: { y: 0 },
        hover: {
            y: -1,
            transition: transitions.fast
        },
    } as Variants,

    // 淡入上移
    fadeInUp: {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: transitions.slow },
        exit: { opacity: 0, y: 12, transition: transitions.fast },
    } as Variants,

    // 淡入
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: transitions.normal },
        exit: { opacity: 0, transition: transitions.fast },
    } as Variants,

    // 展开折叠
    expand: {
        initial: { height: 0, opacity: 0 },
        animate: {
            height: 'auto',
            opacity: 1,
            transition: transitions.expand
        },
        exit: {
            height: 0,
            opacity: 0,
            transition: { duration: 0.15 }
        },
    } as Variants,

    // 底部滑入
    slideUp: {
        initial: { y: '100%', opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: transitions.springBounce
        },
        exit: {
            y: '100%',
            opacity: 0,
            transition: transitions.fast
        },
    } as Variants,

    // Modal 缩放进入
    scaleIn: {
        initial: { scale: 0.95, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: transitions.spring
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            transition: transitions.fast
        },
    } as Variants,
};

// ========================================
// 列表交错动画
// ========================================
export const staggerContainer = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.05 }
    },
} as Variants;

export const staggerItem = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: transitions.normal },
} as Variants;

// ========================================
// 工具函数
// ========================================
export const hoverAnimation = {
    whileHover: { y: -1 },
    whileTap: { scale: 0.97 },
    transition: transitions.fast,
};

export const listItemAnimation = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: transitions.normal,
};
