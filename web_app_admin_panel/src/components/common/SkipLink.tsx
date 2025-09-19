import React from 'react';
import { styled } from '@mui/material/styles';

const StyledSkipLink = styled('a')(({ theme }) => ({
  position: 'fixed',
  top: -100,
  left: 16,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  textDecoration: 'none',
  zIndex: theme.zIndex.tooltip + 1,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:focus': {
    top: 16,
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export default function SkipLink({ targetId, children }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <StyledSkipLink href={`#${targetId}`} onClick={handleClick}>
      {children}
    </StyledSkipLink>
  );
}