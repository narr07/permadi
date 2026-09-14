# Laws Map

Use this map to choose the smallest set of UX laws that actually matters for the current task.

## How To Read This Map

- `Strong`: robust and repeatedly useful across product contexts.
- `Moderate`: useful but interpretation depends on task and audience.
- `Heuristic`: practical framing tool; validate in your product context.

Prefer a small set of laws with clear tradeoffs over citing many laws.

## Primary Laws

These are the default laws to use when making core UX decisions.

- Jakob's Law / 雅各布定律: Users expect interfaces to work like other products they already know. Use familiar patterns for navigation, forms, filters, commerce, account flows, and core domain interactions.
- Fitts's Law / 菲茨法则: Larger, closer targets are easier and faster to acquire. Use it for button size, spacing, hit areas, touch targets, toolbar placement, and frequent controls.
- Miller's Law / 记忆法则 (Moderate): Working memory is limited. Use chunking, visible references, summaries, previews, and grouped navigation instead of asking users to remember.
- Hick's Law / 希克定律: Decision time increases with the number and complexity of choices. Reduce, group, sequence, or recommend choices.
- Postel's Law / 波斯特法则: Be flexible in what you accept and clear in what you return. Accept varied input formats where safe, normalize output, and provide forgiving validation.
- Peak-End Rule / 峰终法则: Users judge experiences disproportionately by intense moments and endings. Design errors, waits, handoffs, completion, and final confirmations carefully.
- Aesthetic-Usability Effect / 美学可用性效应: Users often perceive polished interfaces as easier to use. Use craft and visual coherence to build trust, but never to hide real usability problems.
- Von Restorff Effect / 冯·雷斯托夫效应: Distinctive items are more likely to be noticed and remembered. Reserve strong contrast, color, motion, or placement for what truly matters.
- Tesler's Law / 特斯勒定律: Every system has irreducible complexity. Decide whether complexity belongs with the user, the UI, automation, defaults, or a later step.
- Doherty Threshold / 多尔蒂阈值: Fast feedback keeps users engaged. Respond immediately with local state, skeletons, progress, optimistic updates, or clear pending states.

Note on memory limits:

- Do not treat "7 +/- 2" as a strict UI rule.
- For active task memory in interfaces, designing around roughly 3-5 chunks is often safer.

## Secondary Laws

Use these to diagnose, refine, and support the Primary laws.

- Choice Overload / 选择过载: Too many options can reduce confidence and action. Curate, recommend, compare, filter, or stage options.
- Chunking / 组块: Group information into meaningful units. Apply to forms, dashboards, onboarding, menus, and dense copy.
- Cognitive Bias / 认知偏差: Users make systematic judgment shortcuts. Check for anchoring, default bias, confirmation bias, loss aversion, and framing effects.
- Cognitive Load / 认知负荷: Users have limited mental bandwidth. Remove unnecessary interpretation, memory work, context switching, and ambiguous labels.
- Flow / 心流状态: Good interaction keeps users in a focused, low-friction loop. Avoid interruptions, unclear next steps, and needless mode changes.
- Goal-Gradient Effect / 目标梯度效应: Motivation increases as users approach a goal. Show progress, remaining steps, and meaningful completion signals.
- Law of Common Region / 共同区域法则: Items inside a shared boundary feel related. Use panels, fieldsets, table sections, cards, and grouped controls with purpose.
- Law of Proximity / 邻近原理: Nearby items are perceived as related. Keep labels, inputs, errors, explanations, and actions close to the objects they affect.
- Law of Prägnanz / 简单优先原则: People interpret ambiguous visuals as the simplest stable form. Prefer clear shapes, straightforward layouts, and simple grouping.
- Law of Similarity / 相似性法则: Similar-looking items are perceived as related. Use consistent styling for same-level actions and distinct styling for different roles.
- Law of Uniform Connectedness / 统一连接原则: Visually connected items are perceived as part of the same system. Use lines, arrows, timelines, and dependency visuals intentionally.
- Mental Model / 心智模型: Users bring assumptions about how things work. Match language, sequencing, and behavior to the user's real-world model.
- Occam's Razor / 奥卡姆剃刀原理: Prefer the simplest explanation or design that solves the real problem. Remove ornamental structure and unnecessary paths.
- Paradox of the Active User / 主动用户悖论: Users often start acting before reading instructions. Make first actions discoverable, forgiving, and learnable in context.
- Pareto Principle / 帕累托法则: A small set of actions or users often drives most outcomes. Prioritize the common, high-value paths.
- Parkinson's Law / 帕金森定律: Work expands to fill available time. Use constraints, defaults, time boxes, and scoped steps to prevent drag.
- Selective Attention / 选择性注意力: Users notice what matches their current goal and may miss the rest. Keep critical cues task-relevant and visually distinct.
- Serial Position Effect / 序列位置效应: First and last items are remembered best. Put key starts, endings, and summaries where memory favors them.
- Working Memory / 工作记忆: Users can hold only limited active information. Keep dependencies visible and avoid multi-step recall.
- Zeigarnik Effect / 蔡格尼克效应: Incomplete tasks stay active in memory. Use progress, drafts, reminders, and clear continuation points.
- Form Follows Function / 形式追随功能 (Heuristic): Let task purpose drive structure before decoration. Useful for preventing style-led complexity.
- Inverted Pyramid / 倒金字塔结构 (Heuristic): Put high-value information first, then detail. Useful for content-heavy views and docs.
- LATCH / 五架帽理论 (Heuristic): Organize information by location, alphabet, time, category, hierarchy when building navigation and information architecture.

## Decision Speed And Effort

- Hick's Law: Decision time grows with the number and complexity of choices. Use it to simplify menus, onboarding, filter panels, settings, and pricing choices.
- Miller's Law: People can hold only a limited number of items in working memory. Use chunking, grouping, summaries, and visible references.
- Tesler's Law: Every system has irreducible complexity. Decide whether complexity belongs with the user, the interface, or automation.
- Cognitive Load: Users have limited mental bandwidth. Remove unnecessary interpretation, memory work, and context switching.

## Attention And Visual Hierarchy

- Fitts's Law: Targets should be large enough and close enough for easy interaction. Apply to buttons, menus, touch targets, and frequent controls.
- Von Restorff Effect: Distinct items are more likely to be noticed and remembered. Reserve distinct styling for important actions or information.
- Prägnanz: People interpret ambiguous visuals as the simplest stable form. Prefer clear shapes, straightforward layouts, and simple grouping.
- Figure-Ground: Users separate focal content from background. Ensure foreground content has enough contrast and clear boundaries.

## Grouping And Structure

- Proximity: Nearby items are perceived as related. Put labels, inputs, errors, and controls close to their objects.
- Similarity: Similar-looking items are perceived as related. Use consistent styling for same-level actions and different styling for different roles.
- Common Region: Items inside a shared boundary feel related. Use panels, fieldsets, table sections, and grouped controls with purpose.
- Connectedness: Visually connected items are perceived as part of the same system. Use lines, arrows, timelines, and dependency visuals carefully.

## Familiarity And Expectation

- Jakob's Law: Users spend most of their time in other products. Follow familiar patterns unless the product has a strong reason to differ.
- Mental Models: Users bring assumptions about how things work. Match language, sequencing, and behavior to the user's model.
- Serial Position Effect: First and last items are remembered best. Put key starts, endings, and summaries where memory favors them.
- Aesthetic-Usability Effect: Users often perceive attractive products as easier to use. Use polish to build trust, but never to hide usability problems.

## Feedback, Time, And Momentum

- Doherty Threshold: Fast feedback keeps users engaged. Respond quickly with local state, skeletons, progress, or instant validation.
- Zeigarnik Effect: Incomplete tasks stay active in memory. Use progress markers, drafts, reminders, and clear next steps.
- Goal-Gradient Effect: Motivation increases as users approach a goal. Show progress, remaining steps, and meaningful completion signals.
- Peak-End Rule: Users judge experiences disproportionately by intense moments and endings. Design errors, wait states, and final confirmation carefully.

## Motivation, Bias, And Behavior

- Flow: Keep users moving through clear next actions, fast feedback, and low interruption.
- Choice Overload: Reduce option sets, provide recommendations, and support comparison when users face many alternatives.
- Cognitive Bias: Watch for framing, default effects, anchoring, and loss aversion in pricing, onboarding, settings, and decision screens.
- Pareto Principle: Optimize the top recurring tasks before polishing low-frequency paths.
- Parkinson's Law: Scope time-consuming tasks with constraints, milestones, and sensible defaults.
- Paradox of the Active User: Assume users will try before reading; make the interface teach through doing.
- Occam's Razor: Simplify until further removal would damage comprehension, control, or trust.

## Robustness And Forgiveness

- Postel's Law: Be flexible in what you accept and clear in what you output. Accept varied input formats where safe; normalize and explain results.
- Error Prevention: Prevent problems before they happen. Use constraints, previews, validation, confirmations, and reversible actions.
- Recoverability: Users need a path back. Provide undo, edit, retry, restore, and saved drafts where mistakes are likely.

## Quick Selection Guide

- Too many buttons or filters: Hick's Law, Choice Overload, Miller's Law, Proximity.
- Hard-to-find primary action: Fitts's Law, Von Restorff Effect, Selective Attention, Serial Position Effect.
- Confusing form: Proximity, Cognitive Load, Error Prevention, Postel's Law.
- Slow or uncertain operation: Doherty Threshold, Zeigarnik Effect, Flow, Peak-End Rule.
- Unfamiliar navigation: Jakob's Law, Mental Models.
- Dense dashboard: Common Region, Similarity, Figure-Ground, Cognitive Load.
- High-risk action: Error Prevention, Recoverability, Peak-End Rule.
- Long onboarding: Goal-Gradient Effect, Zeigarnik Effect, Hick's Law, Paradox of the Active User.
- Pretty but confusing interface: Aesthetic-Usability Effect, Cognitive Load, Mental Model.
- Feature-heavy product: Pareto Principle, Tesler's Law, Occam's Razor, Progressive Disclosure.

## Caution Cases

- If this is a safety-critical, financial, or legal workflow, add explicit safeguards even if they increase friction.
- If users are experts, excessive simplification can reduce trust and control.
- If metrics conflict with a law-based suggestion, prioritize measured behavior and reframe the law as a hypothesis.
