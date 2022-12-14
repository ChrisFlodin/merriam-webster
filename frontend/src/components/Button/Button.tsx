import style from "./Button.module.scss";
import classNames from "classnames";
import { MouseEventHandler } from "react";

const { flat, outlined, selectedStyle } = style;

interface ButtonProps {
  children?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  classes?: string;
  selected?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  name?: string;
  variant?: "flat" | "outlined";
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  classes = "",
  selected = false,
  type = "button",
  variant = "flat",
  name,
  disabled = false,
  ...rest
}: ButtonProps) => {
  const variantStyle = variant === "outlined" ? outlined : flat;
  const styles = classNames({
    [selectedStyle]: selected,
    [variantStyle]: variantStyle,
    [classes]: classes,
  });

  return (
    <>
      <button type={type} className={styles} onClick={onClick} name={name} disabled={disabled} {...rest}>
        {children}
      </button>
    </>
  );
};

export default Button;
