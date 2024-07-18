/* eslint-disable require-jsdoc */

type CalloutProps = {
  emoji: React.ReactNode;
  children: React.ReactNode;
};

export const Callout: React.FC<CalloutProps> = (props) => {
  return (
    <div className="my-8 flex rounded-lg border border-muted-foreground p-4">
      <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
      <div className="callout w-full">{props.children}</div>
    </div>
  );
};
