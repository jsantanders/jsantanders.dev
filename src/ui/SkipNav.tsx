/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable prefer-const */

//TODO: Copy from https://github.com/reach/reach-ui/blob/main/packages/skip-nav/src/reach-skip-nav.tsx
// reach ui haven't added support for React 18 yet

import * as React from "react";

// adapted from https://github.com/radix-ui/primitives/blob/2f139a832ba0cdfd445c937ebf63c2e79e0ef7ed/packages/react/polymorphic/src/ts
// Would have liked to use it directly instead of copying but they are
// (rightfully) treating it as an internal utility, so copy/paste it is to
// prevent any needless churn if they make breaking changes. Big thanks to Jenna
// for the heavy lifting! https://github.com/jjenzz

declare const __DEV__: boolean;

type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

/**
 * Infers the OwnProps if E is a ForwardRefExoticComponentWithAs
 */
type OwnProps<E> = E extends ForwardRefComponent<any, infer P> ? P : {};

/**
 * Infers the JSX.IntrinsicElement if E is a ForwardRefExoticComponentWithAs
 */
type IntrinsicElement<E> = E extends ForwardRefComponent<infer I, any> ? I : never;

type ForwardRefExoticComponent<E, OwnProps> = React.ForwardRefExoticComponent<
  Merge<E extends React.ElementType ? React.ComponentPropsWithRef<E> : never, OwnProps & { as?: E }>
>;

interface ForwardRefComponent<
  IntrinsicElementString,
  OwnProps = {}
  /*
   * Extends original type to ensure built in React types play nice with
   * polymorphic components still e.g. `React.ElementRef` etc.
   */
> extends ForwardRefExoticComponent<IntrinsicElementString, OwnProps> {
  /*
   * When `as` prop is passed, use this overload. Merges original own props
   * (without DOM props) and the inferred props from `as` element with the own
   * props taking precendence.
   *
   * We explicitly avoid `React.ElementType` and manually narrow the prop types
   * so that events are typed when using JSX.IntrinsicElements.
   */
  <As = IntrinsicElementString>(
    props: As extends ""
      ? { as: keyof JSX.IntrinsicElements }
      : As extends React.ComponentType<infer P>
      ? Merge<P, OwnProps & { as: As }>
      : As extends keyof JSX.IntrinsicElements
      ? Merge<JSX.IntrinsicElements[As], OwnProps & { as: As }>
      : never
  ): React.ReactElement | null;
}

interface MemoComponent<IntrinsicElementString, OwnProps = {}>
  extends React.MemoExoticComponent<ForwardRefComponent<IntrinsicElementString, OwnProps>> {
  <As = IntrinsicElementString>(
    props: As extends ""
      ? { as: keyof JSX.IntrinsicElements }
      : As extends React.ComponentType<infer P>
      ? Merge<P, OwnProps & { as: As }>
      : As extends keyof JSX.IntrinsicElements
      ? Merge<JSX.IntrinsicElements[As], OwnProps & { as: As }>
      : never
  ): React.ReactElement | null;
}

/** @internal */
export default () => {
  if (__DEV__) {
    throw new Error(
      "@reach/polymorphic is a package for internal utility types and should not be used directly."
    );
  }
};

export type { ForwardRefComponent, IntrinsicElement, MemoComponent, Merge, OwnProps };

// The user may want to provide their own ID (maybe there are multiple nav
// menus on a page a use might want to skip at various points in tabbing?).
let defaultId = "reach-skip-nav";

////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavLink
 *
 * Renders a link that remains hidden until focused to skip to the main content.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavlink
 */
const SkipNavLink = React.forwardRef(function SkipNavLink(
  { as: Comp = "a", children = "Skip to content", contentId, ...props },
  forwardedRef
) {
  let id = contentId || defaultId;
  return (
    <Comp
      {...props}
      ref={forwardedRef}
      href={`#${id}`}
      // TODO: Remove in 1.0 (kept for back compat)
      data-reach-skip-link=""
      data-reach-skip-nav-link=""
    >
      {children}
    </Comp>
  );
}) as ForwardRefComponent<"a", SkipNavLinkProps>;

/**
 * @see Docs https://reach.tech/skip-nav#skipnavlink-props
 */
interface SkipNavLinkProps {
  /**
   * Allows you to change the text for your preferred phrase or localization.
   *
   * @see Docs https://reach.tech/skip-nav#skipnavlink-children
   */
  children?: React.ReactNode;
  /**
   * An alternative ID for `SkipNavContent`. If used, the same value must be
   * provided to the `id` prop in `SkipNavContent`.
   *
   * @see Docs https://reach.tech/skip-nav#skipnavlink-contentid
   */
  contentId?: string;
}

SkipNavLink.displayName = "SkipNavLink";

////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavContent
 *
 * Renders a div as the target for the link.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavcontent
 */
const SkipNavContent = React.forwardRef(function SkipNavContent(
  { as: Comp = "div", id: idProp, ...props },
  forwardedRef
) {
  let id = idProp || defaultId;
  return <Comp {...props} ref={forwardedRef} id={id} data-reach-skip-nav-content="" />;
}) as ForwardRefComponent<"div", SkipNavContentProps>;

/**
 * @see Docs https://reach.tech/skip-nav#skipnavcontent-props
 */
interface SkipNavContentProps {
  /**
   * You can place the `SkipNavContent` element as a sibling to your main
   * content or as a wrapper.
   *
   * Keep in mind it renders a `div`, so it may mess with your CSS depending on
   * where it’s placed.
   *
   * @example
   *   <SkipNavContent />
   *   <YourMainContent />
   *   // vs.
   *   <SkipNavContent>
   *     <YourMainContent/>
   *   </SkipNavContent>
   *
   * @see Docs https://reach.tech/skip-nav#skipnavcontent-children
   */
  children?: React.ReactNode;
  /**
   * An alternative ID. If used, the same value must be provided to the
   * `contentId` prop in `SkipNavLink`.
   *
   * @see Docs https://reach.tech/skip-nav#skipnavcontent-id
   */
  id?: string;
}

SkipNavContent.displayName = "SkipNavContent";

////////////////////////////////////////////////////////////////////////////////
// Exports

export type { SkipNavContentProps, SkipNavLinkProps };
export { SkipNavLink, SkipNavContent };
