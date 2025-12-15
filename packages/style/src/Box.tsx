import {
  colorPaletteLevels,
  type ColorPalette,
} from '@rds/constants/colorPalettes'
import { omit, pick } from '@rds/utils/object'
import { mergeProps } from '@rds/utils/props'
import React, { useLayoutEffect, useMemo } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { kebabCase } from 'string-ts'
import { useStyleSheet, generateStyleClassName } from './useStyleSheet'

const stylePropertyKeys = [
  'position',
  'top',
  'left',
  'bottom',
  'right',
  'transform',
  'transformOrigin',
  'perspective',
  'display',
  'visibility',
  'zIndex',

  'margin',
  'marginTop',
  'marginLeft',
  'marginBottom',
  'marginRight',

  'padding',
  'paddingTop',
  'paddingLeft',
  'paddingBottom',
  'paddingRight',

  'width',
  'height',
  'maxWidth',
  'minWidth',
  'maxHeight',
  'minHeight',
  'boxSizing',
  'contain',

  'border',
  'borderTop',
  'borderLeft',
  'borderRight',
  'borderBottom',
  'borderStyle',
  'borderWidth',
  'borderColor',
  'boxShadow',

  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',

  'flex',
  'flexShrink',
  'flexGrow',
  'flexBasis',
  'flexWrap',
  'flexDirection',
  'alignItems',
  'alignSelf',
  'alignContent',
  'justifyContent',
  'order',

  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',
  'gridColumn',
  'gridRow',
  'gridArea',
  'gap',
  'rowGap',
  'columnGap',
  'placeContent',
  'placeItems',

  'font',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'textAlign',
  'textAlignLast',
  'textDecoration',
  'textDecorationColor',
  'textDecorationStyle',
  'textDecorationLine',
  'textIndent',
  'textOverflow',
  'textTransform',
  'whiteSpace',
  'wordBreak',
  'wordWrap',
  'letterSpacing',

  'color',
  'lineHeight',

  'background',
  'backgroundColor',
  'backgroundImage',
  'backgroundSize',
  'backgroundRepeat',
  'backgroundPosition',
  'backgroundAttachment',

  'opacity',
  'pointerEvents',
  'cursor',
  'userSelect',

  'overflow',
  'overflowX',
  'overflowY',
  'overscrollBehavior',
  'overflowWrap',

  'transition',
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',

  'animation',
  'animationName',
  'animationDuration',
  'animationTimingFunction',
  'animationDelay',
  'animationIterationCount',
  'animationDirection',
  'animationFillMode',
  'animationPlayState',

  'filter',
  'backdropFilter',
  'clipPath',

  'float',
  'clear',
  'listStyle',
] as const

type StyleKey = (typeof stylePropertyKeys)[number]

const themeVariableKeys = ['size', 'borderRadius', 'fontSize'] as const

type ThemeVariableKey = (typeof themeVariableKeys)[number]

export type StyleProperties = Pick<React.CSSProperties, StyleKey>

type DefaultElement = 'div'

interface BoxOwnProps {
  as?: React.ElementType
  asChild?: boolean
  children?: React.ReactNode
}

export type BoxProps<Root extends React.ElementType = DefaultElement> =
  React.ComponentPropsWithoutRef<Root> &
    Omit<BoxOwnProps, 'as'> &
    BoxOwnProps &
    StyleProperties & {
      colorPalette?: ColorPalette
      theme?: Partial<Record<ThemeVariableKey, number | string>> & {
        [key: string]: string | number
      }
      [key: `data-${string}`]: any
    }

const BoxComponent = React.forwardRef(
  <T extends React.ElementType = DefaultElement>(
    {
      as = 'div',
      asChild,
      children,
      colorPalette,
      theme,
      ...restProps
    }: BoxProps<T>,
    ref: React.Ref<any>
  ) => {
    const styleSheet = useStyleSheet()
    const Component = asChild ? Slot : as

    const colorPaletteVars = useMemo(() => {
      if (!colorPalette) return

      let _colorPalette = colorPalette
      if (_colorPalette === 'danger') _colorPalette = 'red'
      if (_colorPalette === 'success') _colorPalette = 'green'
      if (_colorPalette === 'warning') _colorPalette = 'yellow'
      return colorPaletteLevels.reduce((pre, cur) => {
        return {
          ...pre,
          [`--color-palette-${cur}`]: `var(--color-${_colorPalette}-${cur})`,
        }
      }, {})
    }, [colorPalette])

    const themeVars = useMemo(() => {
      if (!theme) return {}
      return Object.entries(theme).reduce((pre, [key, value]) => {
        return {
          ...pre,
          [`--${kebabCase(key)}`]: value,
        }
      }, {})
    }, [theme])

    const componentProps = omit(restProps, ...stylePropertyKeys)
    const styleProps = pick(restProps, ...stylePropertyKeys)

    useLayoutEffect(() => {
      styleSheet(styleProps)
    }, [styleProps, styleSheet])

    const styleEntries = Object.entries(styleProps as Record<string, unknown>)

    const mergedProps = mergeProps(componentProps, {
      className: styleEntries
        .map(([key, value]) => {
          return generateStyleClassName(kebabCase(key), value as any)
        })
        .join(' '),
      style: {
        ...colorPaletteVars,
        ...themeVars,
      },
    })

    return (
      <Component
        ref={ref}
        {...mergedProps}
        {...(Boolean(colorPalette) && { 'data-color-palette': colorPalette })}
        data-box
      >
        {children}
      </Component>
    )
  }
)

export type PolymorphicComponent = <
  T extends React.ElementType = DefaultElement,
>(
  props: BoxProps<T> & { ref?: React.Ref<any> }
) => React.ReactElement | null

export interface PolymorphicComponentType<
  T extends React.ElementType = DefaultElement,
> {
  (props: BoxProps<T> & { ref?: React.Ref<any> }): React.ReactElement | null
}

export const Box: PolymorphicComponent & { displayName?: string } =
  BoxComponent as PolymorphicComponent & { displayName?: string }

Box.displayName = 'Box'
