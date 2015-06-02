title: logging
tags: kafka
---

理解log是用好kafka的关键, linkenin的[这篇文章](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)已经介绍的很清楚了, 强烈推荐阅读

借用文章中的一句话:

>> A log is perhaps the simplest possible storage abstraction. It is an append-only, totally-ordered sequence of records ordered by time.

注意这里的几个关键词, append-only, ordered, by time.

这个抽象也是很多设计的基础, 例如银行的账本, 比特币的钱包, 数据库的主从复制等等.

试想一个数据库系统, 如果我们把对它的每一个修改操作(无论是增加, 删除还是修改)都按接收到此操作请求的顺序, 把请求在一个文件中保存起来, 那么只要这个数据库系统重启的时候, 依次读取这个文件中的请求, 按照每个请求的内容对内存中的状态进行修改, 就肯定又能够得到这个数据库重启之前的状态了; 并且, 如果我们把这个文件拷贝到另外的机器上, 新启动一个数据库实例, 那么这个数据库实例中也会得到同样的结果.

{% digraph G %}
  node[shape=record];
  A -> B;
{% enddigraph %}


