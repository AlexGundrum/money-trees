'use client';
import { useState, useEffect } from 'react';
import styles from './Budgeting.module.css';
import { analyzeText } from '@/services/api';
import Image from 'next/image';

export default function BudgetingPage() {
  const [selectedText, setSelectedText] = useState('');
  const [fullContext, setFullContext] = useState('');
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        setSelectedText(text);
        
        // Get the full context (the entire section)
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        
        // Find the closest section element
        let section = null;
        let element = startContainer;
        
        // If startContainer is a text node, get its parent
        if (startContainer.nodeType === Node.TEXT_NODE) {
          element = startContainer.parentElement;
        }
        
        // Traverse up until we find a section
        while (element && element.tagName !== 'SECTION') {
          element = element.parentElement;
        }
        
        if (element && element.tagName === 'SECTION') {
          section = element;
        }
        
        if (section) {
          const sectionText = Array.from(section.querySelectorAll('p'))
            .map(p => p.textContent)
            .join('\n');
          setFullContext(sectionText);
        }
        
        setShowSubmitButton(true);
        
        // Get the selection coordinates
        const rect = range.getBoundingClientRect();
        setButtonPosition({
          x: rect.left + (rect.width / 2),
          y: rect.bottom + window.scrollY + 10
        });
      } else {
        setShowSubmitButton(false);
        setSelectedText('');
        setFullContext('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeText(fullContext, selectedText);
      setAnalysis(data);
      setShowModal(true);
      
      // Clear selection and hide button
      window.getSelection().removeAllRanges();
      setShowSubmitButton(false);
      setSelectedText('');
      setFullContext('');
    } catch (error) {
      setError('Failed to analyze text. Please try again.');
      console.error('Error analyzing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <a href="/budgeting">Home</a>
        <a href="/income">Income</a>
        <a href="/debt">Debt</a>
        <a href="/investment">Investment</a>
        <a href="/savings">Savings</a>
        <div className={styles.dropdown}>
          <a href="#">Advanced Topics</a>
          <div className={styles.dropdownContent}>
            <a href="/taxes">Taxes</a>
            <a href="/insurance">Insurance</a>
            <a href="/credit">Credit</a>
          </div>
        </div>
      </nav>

      <header className={styles.header}>
        <h1>What is Budgeting?</h1>
        <p>Learn the basics of budgeting and how it can help you take control of your financial future.</p>
      </header>

      <section className={`${styles.section} selectableText`} id="budgeting">
        <h2>What is Budgeting?</h2>
        <p>Budgeting is the process of planning how to spend your money. It involves creating a goal and allocating specific amounts of your income to pay your expenses while meeting your financial goal. By making a conscious plan for where your money will go before you spend it, budgeting helps you manage your finances effectively and achieve your financial goals.</p>
        <Image
          src="/images/budgeting-concept.jpg"
          alt="Budgeting concept"
          width={600}
          height={400}
          className={styles.image}
        />
      </section>

      <section className={`${styles.section} selectableText`} id="why-budgeting">
        <h2>Why is Budgeting Important?</h2>
        <p>One of the most significant benefits of budgeting is that it prevents you from living paycheck to paycheck. Without a clear plan, it's easy to spend impulsively and end up with no savings. By budgeting your income and expenses, you create a buffer that helps you manage your money and avoid financial stress.</p>
        <p>Planning your spending ensures that you're not scrambling for money when bills are due or relying on credit to get by. Additionally, that money spent can be put towards more meaningful contributions such as emergency funds, investment plans, or paying off debt.</p>
        <Image
          src="/images/budgeting-chart.jpg"
          alt="Important budgeting chart"
          width={600}
          height={400}
          className={styles.image}
        />
      </section>

      <section className={`${styles.section} selectableText`} id="investment">
        <h2>The Power of Redirecting Your Income</h2>
        <p>Redirecting your income into investments rather than spending it on leisure expenses can have a profound impact on your long-term financial security. While enjoying life's pleasures is important, the power of investing lies in its ability to grow your money over time, setting you up for future financial freedom.</p>
        <p>By consistently putting a portion of your income into investments—whether it's a retirement fund, stocks, or real estate—you're allowing your money to work for you, creating a growing source of wealth that compounds over the years.</p>
        <Image
          src="/images/investment-chart.jpg"
          alt="Investment growth chart"
          width={600}
          height={400}
          className={styles.image}
        />
      </section>

      <section className={`${styles.section} selectableText`} id="budgeting-dynamic">
        <h2>Budgeting is Dynamic</h2>
        <p>As life changes—whether it's a new job, an unexpected expense, or a change in your financial goals—your budget should be adjusted accordingly. Regularly reviewing and tweaking your budget ensures that it continues to reflect your current financial situation. If you struggle to meet your goals, it's important to evaluate and adjust your budget to work better for you. Remember, a budget exists to help you!</p>
        <Image
          src="/images/dynamic-budgeting.jpg"
          alt="Dynamic budgeting"
          width={600}
          height={400}
          className={styles.image}
        />
      </section>

      <section className={`${styles.section} selectableText`} id="next-steps">
        <h2>Next Steps</h2>
        <p>With a budget in place, a set amount of money should be set aside for addressing debts, savings, and investments. Again, a budget varies person to person. One person may put all of this money towards debt, while another may choose to focus on building an emergency fund.</p>
        <p>It is important to have an understanding of how addressing debt, creating emergency funds, and investing each contribute toward a long-term financial plan.</p>
        <Image
          src="/images/financial-planning.jpg"
          alt="Financial planning"
          width={600}
          height={400}
          className={styles.image}
        />
      </section>

      <footer className={styles.footer}>
        <p>For more information, visit our <a href="#">Personal Finance Guide</a>.</p>
      </footer>

      {showSubmitButton && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          Analyze Text
        </button>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            
            {loading ? (
              <div className={styles.loading}>Analyzing text...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : analysis ? (
              <>
                <h2>Analysis Results</h2>
                <div className={styles.analysisSection}>
                  <h3>Clearer Explanation</h3>
                  <p className={styles.restatement}>{analysis.restatement}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Key Financial Implications</h3>
                  <p>{analysis.implications}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Potential Risks or Concerns</h3>
                  <p>{analysis.risks}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Recommendations for Improvement</h3>
                  <p>{analysis.recommendations}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Related Financial Concepts</h3>
                  <p>{analysis.related_concepts}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
} 