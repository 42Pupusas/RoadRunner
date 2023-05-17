import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Icon } from 'leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

interface FontAwesomeIconOptions {
  icon: IconDefinition;
  style?: React.CSSProperties;
}

export const createFontAwesomeIcon = (
  options: FontAwesomeIconOptions
): Icon => {
  const { icon, style } = options;
  const iconMarkup = renderToStaticMarkup(
    <FontAwesomeIcon style={style} icon={icon} />
  );
  const iconUrl = `data:image/svg+xml;base64,${Buffer.from(iconMarkup).toString(
    'base64'
  )}`;

  return L.icon({
    iconUrl,
    iconSize: [42, 42],
    iconAnchor: [8, 42],
  });
};
