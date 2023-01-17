import { ServiceEndpointDefinition } from '@apollo/gateway';

const formatService = (
  serviceIdentifier: string,
): ServiceEndpointDefinition => {
  const [url, name] = serviceIdentifier.split(',');
  return {
    url,
    name,
  };
};

export const getServiceList = () => {
  const serviceEnvString = process.env.SERVICE_LIST;
  const serviceIdentifiers = serviceEnvString.split('|').filter(Boolean);
  return serviceIdentifiers.map(formatService);
};
