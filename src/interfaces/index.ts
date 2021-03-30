interface IRedisConfig {
  /** redis端口号 */
  port: number,
  /** redis 地址 */
  host: string,
  /** redis 密码 */
  password: string,
  /** redis使用的数据库 */
  db: number
}

export interface IRedisApiCacheConfig {
  /** redis数据库连接 */
  redisConfig: IRedisConfig,
  /** redis默认缓存时间 */
  redisEXSecond?: number
}