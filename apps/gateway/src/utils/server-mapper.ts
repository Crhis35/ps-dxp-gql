import { MercuriusGatewayService } from 'mercurius';

const formatService = (serviceIdentifier: string): MercuriusGatewayService => {
  const [urls, name] = serviceIdentifier.split(',');
  const [url, wsUrl] = urls.split(';');
  return {
    url,
    name,
    wsUrl,
  };
};

export const getServiceList = () => {
  const serviceEnvString = process.env.SERVICE_LIST;
  const serviceIdentifiers = serviceEnvString.split('|').filter(Boolean);
  return serviceIdentifiers.map(formatService);
};
