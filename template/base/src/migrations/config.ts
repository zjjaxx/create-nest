import { join, resolve } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const parse = (path: string) => {
  if (fs.existsSync(path)) {
    const config = dotenv.parse(fs.readFileSync(path, 'utf-8'));
    return config;
  }
  return {};
};

const getConfig = () => {
  const defaultConfig = parse(resolve(__dirname, '../../.env'));
  const config = parse(
    resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
  );
  return {
    ...defaultConfig,
    ...config,
  };
};
const config = getConfig();

export default new DataSource({
  type: 'mysql',
  host: config['DATABASE_HOST'],
  port: parseInt(config['DATABASE_PORT']),
  username: config['DATABASE_USERNAME'],
  password: config['DATABASE_PASSWORD'],
  database: config['DATABASE_DATABASE'],
  entities: [join(__dirname, '../**/*.entity.ts')],
  // 要为此连接加载迁移的文件
  migrations: [join(__dirname, './scripts/*.ts')],
  // 【注意】设置为false
  synchronize: false,
  logging: true,
});
