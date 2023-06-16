interface Good {
  id: string;
  name: string;
  groupId: string;
}

interface GoodView extends Good {
  quantity: number;
  price: number;
}

interface Stock {
  goodId: string;
  groupId: string;
  quantity: number;
  usdPrice: number;
}

type GoodList = Record<string, {
  groupName: string;
  goods: GoodView[];
}>

interface CartItem {
  id: string;
  groupId: string;
  count: number;
}

interface CurrencyRatesResult {
  base: string;
  date: string;
  motd?: {
    msg: string;
    url: string;
  },
  rates?: Record<string, number>;
  success?: boolean;
}
