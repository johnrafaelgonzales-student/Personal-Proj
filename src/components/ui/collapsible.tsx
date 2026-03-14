/**
 * @fileoverview Defines the Collapsible component for creating sections of content that can be expanded and collapsed.
 * It is a direct export from Radix UI's Collapsible primitive.
 * This component is part of the ShadCN UI library.
 * @see https://ui.shadcn.com/docs/components/collapsible
 */
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
