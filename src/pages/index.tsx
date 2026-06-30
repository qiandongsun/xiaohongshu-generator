import { useState } from 'react';

const categories = [
  { id: '美妆', name: '美妆' },
  { id: '家居', name: '家居' },
  { id: '职场', name: '职场' },
  { id: '穿搭', name: '穿搭' },
  { id: '美食', name: '美食' },
  { id: '育儿', name: '育儿' },
  { id: '情感', name: '情感' },
];

const styleOptions = [
  { id: '干货型', name: '干货型' },
  { id: '种草型', name: '种草型' },
  { id: '吐槽型', name: '吐槽型' },
  { id: '故事型', name: '故事型' },
];

const contentTypes = [
  { id: 'title', name: '标题' },
  { id: 'content', name: '正文' },
  { id: 'both', name: '标题+正文' },
];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('美妆');
  const [style, setStyle] = useState('干货型');
  const [contentType, setContentType] = useState('both');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入主题');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, style, contentType }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || '生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>小红书爆款文案生成器</h1>
        <p style={styles.subtitle}>输入关键词，10 秒生成爆款标题和正文</p>

        <div style={styles.section}>
          <label style={styles.label}>笔记主题</label>
          <input
            style={styles.input}
            placeholder="例如：早八通勤穿搭"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>选择赛道</label>
          <div style={styles.buttonGroup}>
            {categories.map((c) => (
              <button
                key={c.id}
                style={{
                  ...styles.optionButton,
                  ...(category === c.id ? styles.activeButton : {}),
                }}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>内容类型</label>
          <div style={styles.buttonGroup}>
            {contentTypes.map((t) => (
              <button
                key={t.id}
                style={{
                  ...styles.optionButton,
                  ...(contentType === t.id ? styles.activeButton : {}),
                }}
                onClick={() => setContentType(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>文案风格</label>
          <div style={styles.buttonGroup}>
            {styleOptions.map((s) => (
              <button
                key={s.id}
                style={{
                  ...styles.optionButton,
                  ...(style === s.id ? styles.activeButton : {}),
                }}
                onClick={() => setStyle(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{
            ...styles.generateButton,
            ...(loading ? styles.loadingButton : {}),
          }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '生成中...' : '生成文案'}
        </button>

        {result && (
          <div style={styles.resultSection}>
            <div style={styles.resultHeader}>
              <span style={styles.resultTitle}>生成结果</span>
              <button style={styles.copyButton} onClick={handleCopy}>
                {copied ? '已复制' : '复制全部'}
              </button>
            </div>
            <pre style={styles.resultContent}>{result}</pre>
          </div>
        )}

        <div style={styles.footer}>
          <p>免费版每日 3 次生成</p>
          <button style={styles.upgradeButton}>升级会员</button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff0f3 0%, #fff 50%, #fff0f3 100%)',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '720px',
    background: '#fff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(255, 36, 66, 0.1)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FF2442',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '32px',
  },
  section: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #ffe4e8',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  optionButton: {
    padding: '10px 18px',
    borderRadius: '20px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeButton: {
    background: '#FF2442',
    color: '#fff',
    borderColor: '#FF2442',
  },
  generateButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    background: '#FF2442',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
    marginBottom: '24px',
  },
  loadingButton: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  error: {
    color: '#FF2442',
    marginBottom: '16px',
    fontSize: '14px',
  },
  resultSection: {
    background: '#fff8f9',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  resultTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    background: '#fff',
    border: '1px solid #FF2442',
    color: '#FF2442',
    cursor: 'pointer',
    fontSize: '14px',
  },
  resultContent: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#333',
    fontFamily: 'inherit',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #f0f0f0',
    color: '#999',
    fontSize: '14px',
  },
  upgradeButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    background: '#FF2442',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
