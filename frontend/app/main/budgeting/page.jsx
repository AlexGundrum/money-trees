'use client';
import { useState, useEffect } from 'react';
import styles from './Budgeting.module.css';

export default function BudgetingPage() {
  const [selectedText, setSelectedText] = useState('');
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        setSelectedText(text);
        setShowSubmitButton(true);
        
        // Get the selection coordinates
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setButtonPosition({
          x: rect.left + (rect.width / 2),
          y: rect.bottom + window.scrollY + 10
        });
      } else {
        setShowSubmitButton(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSubmit = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      console.log('Analysis result:', data);
      
      // Clear selection and hide button
      window.getSelection().removeAllRanges();
      setShowSubmitButton(false);
      setSelectedText('');
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
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
        <img src="/images/budgeting-concept.jpg" alt="Budgeting concept" className={styles.image} />
      </section>

      <section className={`${styles.section} selectableText`} id="why-budgeting">
        <h2>Why is Budgeting Important?</h2>
        <p>One of the most significant benefits of budgeting is that it prevents you from living paycheck to paycheck. Without a clear plan, it's easy to spend impulsively and end up with no savings. By budgeting your income and expenses, you create a buffer that helps you manage your money and avoid financial stress.</p>
        <p>Planning your spending ensures that you're not scrambling for money when bills are due or relying on credit to get by. Additionally, that money spent can be put towards more meaningful contributions such as emergency funds, investment plans, or paying off debt.</p>
        <img src="/images/budgeting-chart.jpg" alt="Important budgeting chart" className={styles.image} />
      </section>

      <section className={`${styles.section} selectableText`} id="investment">
        <h2>The Power of Redirecting Your Income</h2>
        <p>Redirecting your income into investments rather than spending it on leisure expenses can have a profound impact on your long-term financial security. While enjoying life's pleasures is important, the power of investing lies in its ability to grow your money over time, setting you up for future financial freedom.</p>
        <p>By consistently putting a portion of your income into investments—whether it's a retirement fund, stocks, or real estate—you're allowing your money to work for you, creating a growing source of wealth that compounds over the years.</p>
        <img src="/images/investment-chart.jpg" alt="Investment growth chart" className={styles.image} />
      </section>

      <section className={`${styles.section} selectableText`} id="budgeting-dynamic">
        <h2>Budgeting is Dynamic</h2>
        <p>As life changes—whether it's a new job, an unexpected expense, or a change in your financial goals—your budget should be adjusted accordingly. Regularly reviewing and tweaking your budget ensures that it continues to reflect your current financial situation. If you struggle to meet your goals, it's important to evaluate and adjust your budget to work better for you. Remember, a budget exists to help you!</p>
        <img src="/images/dynamic-budgeting.jpg" alt="Dynamic budgeting" className={styles.image} />
      </section>

      <section className={`${styles.section} selectableText`} id="next-steps">
        <h2>Next Steps</h2>
        <p>With a budget in place, a set amount of money should be set aside for addressing debts, savings, and investments. Again, a budget varies person to person. One person may put all of this money towards debt, while another may choose to focus on building an emergency fund.</p>
        <p>It is important to have an understanding of how addressing debt, creating emergency funds, and investing each contribute toward a long-term financial plan.</p>
        <img src="/images/financial-planning.jpg" alt="Financial planning" className={styles.image} />
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
    </div>
  );
} 