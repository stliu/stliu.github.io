title: kafka broker id
date: 2015-06-02 16:59:55
tags: kafka
---

根据[Kafka官方文档](http://kafka.apache.org/documentation.html) (见下文)

>> **Broker Node Registry**

>> `/brokers/ids/[0...N] --> host:port (ephemeral node)`

>> This is a list of all present broker nodes, each of which provides a unique logical broker id which identifies it to consumers (which must be given as part of its configuration). On startup, a broker node registers itself by creating a znode with the logical broker id under /brokers/ids. The purpose of the logical broker id is to allow a broker to be moved to a different physical machine without affecting consumers. An attempt to register a broker id that is already in use (say because two servers are configured with the same broker id) is an error.

>> Since the broker registers itself in ZooKeeper using ephemeral znodes, this registration is dynamic and will disappear if the broker is shutdown or dies (thus notifying consumers it is no longer available).

每个broker的信息是保存在zookeeper的`/brokers/ids/[id]`中的, 其值是该broker的一些信息, 例如

	{
	    "jmx_port": -1,
	    "timestamp": "1433071965453",
	    "host": "qc-bj2-kafka4",
	    "version": 1,
	    "port": 9092
	}


这里用到的*id*就是配置文件中需要配置的*broker.id*了


同时, 因为这个`/brokers/ids/[id]`是一个*ephemeral node*, 所以可以用它来实现kafka broker的健康检查, 即watch /brokers/ids 节点, 当有子节点的变化的时候则通知相应的服务, 具体可以参见kakfa源码中的`kafka.server.KafkaHealthcheck`类.

注: kafka的java client已经通过这种方式来自动感知broker的变化了.

这里还有个小问题是默认情况下, kafka broker是对外暴露的是*hostname*, 这就要求集群中配置好DNS或者每个机器都要维护好*/etc/hosts*, 比较麻烦, 或者如果通过VPN连接到集群中的话, 也会遇到本地机器无法通过hostname来访问到kafka broker的问题.

这个问题可以通过配置`advertised.host.name `属性为broker ip来解决


## 自动分配Broker ID

因为一个Kafka Cluster中的broker id不能够重复, 这就给自动部署引起了很大的麻烦, 因为集群中的每个节点都需要一份不同的配置文件了. 

例如, Sematext[^1]的人就[提问了](http://search-hadoop.com/m/4TaT4dTPKi1), 他们是把所有的服务都封装进一个VM里面了, 这样的话, 部署就很方便了, 直接把VM跑起来就可以, 但是当需要scale out的时候, 问题出来了, 因为VM是同一个, 每个VM实例中的配置文件自然也就相同, 于是kafka cluster跑不起来......


### 自己动手丰衣足食

不过广大人民的智慧是无穷的, 你kafka不就是要求`broker.id`是一个小于`Integer.MAX_VALUE`的不重复自然数么, 啥符合要求呢? IP地址啊,集群中的每个机器的IP肯定是不一样的, 那么去掉每个机器IP地址中间的点, 自然就是在一个不重复的数字了.

不过因为`Integer.MAX_VALUE=2147483647`, 而IP最大的为`255255255255`, 比要求的大了两个数量级呢, 还是有一定风险的, 但是因为自己的系统的IP号段分配状况自己知道, 所以很容易就可以判断出这种方案可不可行.

如果IP号段符合的话(也就是所有自己集群中可用的IP地址去掉其中的句点之后的数字都比2147483647)小的话, 那就可以先用一个配置文件去部署kafka, 在启动前再用个脚本去获取IP地址然后去更新配置文件就行了, Puppet, Chef之类的工具也很容易的能够做到这一点.

这个方案的变种还有使用MAC地址之类的, 就不多说了.

### [KAFKA-1070](https://issues.apache.org/jira/browse/KAFKA-1070)

需要的人多了, 于是乎, 就有人在Kafka 的JIRA上提了这个改进的需求[^2]





[^1]: Sematext是美国的一个APM服务提供商, 其提供kafka的监控服务
[^2]: 虽然这个JIRA的类型是Bug, 但是我认为实际上应该是Improvement或者New Feature的, 因为Bug的定义是行为和承诺不符, 如果文档中写了kafka会自动分配broker id, 却没有自动分配或者分配了重复的ID, 那么是一个bug, 可是现在kafka的文档中明明写着需要用户自己配置broker.id的属性, 所以并不存在行为和预期不符的情况, 这个JIRA更多的是需要kafka提供一个新的功能来自动分配broker id, 所以应该Improvement或者New Feature.

## 启用JMX

可以在kafka-run-class.sh的脚本中加入下面两行的方式来启用kafka的JMX支持

	export KAFKA_JMX_OPTS="-Dcom.sun.management.jmxremote=true -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false"
	export JMX_PORT=${JMX_PORT:-9999}                                    

另外, 可以[下载MX4j](http://sourceforge.net/projects/mx4j)并把其中的**mx4j-tools.jar**放到kafka的libs目录下, kafka会自动加载的.

MX4j能够提供给我们一种通过Web方式来访问系统的JMX服务, 避免了通过jconsole, jvisualvm的麻烦, 这样我们就能够直接在web端通过标准的JMX服务来查看或者动态调整一些系统参数和指标了.

MX4j不仅在kafka中有所应用, 在其他很多开源项目中也都有被使用, 例如[cassandra](http://wiki.apache.org/cassandra/Operations#Monitoring_with_MX4J)

因为MX4j提供的是一个web服务, 所以需要制定端口号和绑定的IP

在kafka中, 是通过`-Dmx4jport=8082`和`-Dmx4jaddress=0.0.0.0`来完成的, 这两个也是kafka中的默认值, 具体实现可以参考kafka源码中的`kafka.utils.Mx4jLoader`类.

最常用的情景是我们可以通过JMX的方式来动态的调整一个类的log level, 在定位系统问题的时候会很有帮助.


## 监控

https://github.com/criteo/kafka-ganglia

## replica相关的参数

* default.replication.factor (1)

	The default replication factor for automatically created topics 

	默认的副本数

* replica.lag.time.max.ms (10000)

	follower的最大lag时间，即如果leader在这个时间内都没有收到follower的fetch请求，就认为它dead 

	If a follower hasn't sent any fetch requests for this window of time, the leader will remove the follower from ISR (in-sync replicas) and treat it as dead. 

* replica.lag.max.messages (4000)

	最大lag消息数，超过这个消息数，leader会认为该follower dead 
	
	If a replica falls more than this many messages behind the leader, the leader will remove the follower from ISR and treat it as dead.

* replica.socket.timeout.ms (30 * 1000)

	The socket timeout for network requests to the leader for replicating data. 

* replica.socket.receive.buffer.bytes (64 * 1024)

	The socket receive buffer for network requests to the leader for replicating data.

* replica.fetch.max.bytes (1024 * 1024)

	一次fetch request最大可以fetch的数据size 

	The number of byes of messages to attempt to fetch for each partition in the fetch requests the replicas send to the leader. 

* replica.fetch.wait.max.ms (500)

	fetch request的等待超时 

	The maximum amount of time to wait time for data to arrive on the leader in the fetch requests sent by the replicas to the leader. 

* replica.fetch.min.bytes (1)

	Minimum bytes expected for each fetch response for the fetch requests from the replica to the leader. If not enough bytes, wait up to replica.fetch.wait.max.ms for this many bytes to arrive.

* num.replica.fetchers (1)

	follower上用于同步leader数据的线程数 

	Number of threads used to replicate messages from leaders. Increasing this value can increase the degree of I/O parallelism in the follower broker.

* replica.high.watermark.checkpoint.interval.ms (5000)

	checkpoint HW的interval 

	The frequency with which each replica saves its high watermark to disk to handle recovery.

