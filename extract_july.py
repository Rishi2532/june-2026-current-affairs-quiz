import pymupdf
import re
import json

def extract_july():
    doc = pymupdf.open('guidelyJulyquiz.pdf')
    full_text = []

    for page_idx in range(len(doc)):
        text = doc[page_idx].get_text('text')
        lines = text.split('\n')
        filtered_lines = []
        for line in lines:
            stripped = line.strip()
            if 'Monthly Current Affairs Quiz – July 2026' in stripped:
                continue
            if 'Click Here For Bundle PDF Course' in stripped:
                continue
            if 'If there are any suggestions/ errors in this PDF' in stripped:
                continue
            filtered_lines.append(line)
        full_text.append('\n'.join(filtered_lines))

    combined = '\n'.join(full_text)

    ans_matches = list(re.finditer(r'(?:^|\n)\s*(?:Answer|Ans)\s*[:.]\s*([A-Za-z0-9]+)', combined, re.IGNORECASE))
    print(f'Total Answer matches found: {len(ans_matches)}')

    q_starts = []
    m1 = re.search(r'(?:^|\n)\s*1\.\s+', combined[:ans_matches[0].start()])
    q_starts.append(m1.start())

    for i in range(1, len(ans_matches)):
        item_idx = i + 1
        if item_idx <= 206:
            print_num = item_idx
        elif item_idx == 473:
            print_num = 477 # Misprint in PDF for 474
        else:
            print_num = item_idx + 1 # 207 was skipped in numbering
            
        seg_start = ans_matches[i-1].end()
        seg_end = ans_matches[i].start()
        seg = combined[seg_start:seg_end]
        matches = list(re.finditer(rf'(?:^|\n)\s*{print_num}\.\s+', seg))
        if not matches:
            raise ValueError(f"Could not find question start for item {item_idx} (printed as {print_num}.)")
        q_starts.append(seg_start + matches[0].start())

    def format_question_text(raw_text):
        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
        if not lines:
            return ''
        
        joined = []
        for l in lines:
            if not joined:
                joined.append(l)
                continue
            prev = joined[-1]
            
            is_new_statement = bool(re.match(r'^(?:[0-9]+\.|\([0-9ivxIVX]+\)|•|\*|-)\s+', l))
            is_closing_q = bool(re.match(r'^Which of the\b', l, re.IGNORECASE))
            prev_colon = prev.endswith(':')
            
            if is_new_statement or is_closing_q or prev_colon:
                joined.append(l)
            else:
                prev_is_abbr = bool(re.search(r'\b(?:Dr|Mr|Mrs|Shri|Prof|Govt|Lt|Gen|vs|viz|e\.g|i\.e|No|approx)\.$', prev, re.IGNORECASE))
                if prev.endswith('.') and not prev_is_abbr and prev_colon:
                    joined.append(l)
                elif prev.endswith('.') and not prev_is_abbr and len(l) > 10 and l[0].isupper() and ('consider the following' in raw_text.lower() or 'which of the' in raw_text.lower()):
                    joined.append(l)
                else:
                    joined[-1] = prev + ' ' + l
                    
        return '\n\n'.join(joined)

    def format_explanation_text(raw_text):
        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
        if not lines:
            return ''
            
        paragraphs = []
        current_lines = []
        
        for l in lines:
            is_heading = any(l.startswith(h) for h in [
                'Short Explanation:', 'Detailed Explanation:', 'About ', 'Key Points:', 'Key Highlights:', 'Note:'
            ])
            is_bullet = bool(re.match(r'^(?:[0-9]+\.|\([0-9ivxIVX]+\)|•|\*|-)\s+', l))
            
            if is_heading:
                if current_lines:
                    paragraphs.append(' '.join(current_lines))
                    current_lines = []
                paragraphs.append(l)
            elif is_bullet:
                if current_lines:
                    paragraphs.append(' '.join(current_lines))
                    current_lines = []
                current_lines.append(l)
            else:
                if not current_lines:
                    current_lines.append(l)
                else:
                    prev = current_lines[-1]
                    if prev.endswith(':'):
                        paragraphs.append(' '.join(current_lines))
                        current_lines = [l]
                    elif not re.search(r'[.?!:"\']$', prev):
                        current_lines[-1] = prev + ' ' + l
                    else:
                        prev_is_abbr = bool(re.search(r'\b(?:Dr|Mr|Mrs|Shri|Prof|Govt|Lt|Gen|vs|viz|e\.g|i\.e|No|approx)\.$', prev, re.IGNORECASE))
                        if prev_is_abbr:
                            current_lines[-1] = prev + ' ' + l
                        else:
                            paragraphs.append(' '.join(current_lines))
                            current_lines = [l]
                            
        if current_lines:
            paragraphs.append(' '.join(current_lines))
            
        return '\n\n'.join(paragraphs)

    questions = []
    total_q = len(ans_matches)

    for i in range(total_q):
        q_id = i + 1
        q_block = combined[q_starts[i]:ans_matches[i].start()].strip()
        q_block_clean = re.sub(r'^\d+\.\s*', '', q_block).strip()
        
        correct_ans = ans_matches[i].group(1).strip().upper()
        if correct_ans not in ['A', 'B', 'C', 'D', 'E']:
            raise ValueError(f"Q{q_id} invalid correct answer: {correct_ans}")

        if q_id == 102:
            # Q102 in PDF had Option B omitted and A & C joined: 'A.Pradip Kumar DasC.Ajay Bhushan Pandey'
            opt_a_match = re.search(r'(?:^|\n)\s*A[\.\)]\s*', q_block_clean)
            q_text_raw = q_block_clean[:opt_a_match.start()].strip() if opt_a_match else q_block_clean.split('\n')[0]
            options = [
                {'key': 'A', 'text': 'Pradip Kumar Das'},
                {'key': 'B', 'text': '[Option omitted in original PDF]'},
                {'key': 'C', 'text': 'Ajay Bhushan Pandey'},
                {'key': 'D', 'text': 'Bijay Kumar Mohanty'},
                {'key': 'E', 'text': 'Ramesh Chand'}
            ]
        else:
            # Check for Option A
            opt_a_match = re.search(r'(?:^|\n)\s*A(?:[\.\)]|\s+|(?=[A-Z][a-z]))', q_block_clean)
            if not opt_a_match:
                raise ValueError(f"No option A found in Q{q_id}")
                
            q_text_raw = q_block_clean[:opt_a_match.start()].strip()
            opts_raw = q_block_clean[opt_a_match.start():].strip()
            
            # Handle Q186 where ABanking was written without dot/space
            if q_id == 186:
                opts_raw = re.sub(r'^ABanking', 'A. Banking', opts_raw)
                
            opt_matches = list(re.finditer(r'(?:^|\n)\s*([A-E])(?:[\.\)]|\s+)\s*(.*?)(?=(?:\n\s*[A-E](?:[\.\)]|\s+)|$))', opts_raw, re.DOTALL))
            if len(opt_matches) != 5:
                raise ValueError(f"Q{q_id} has {len(opt_matches)} options, expected 5")
                
            options = []
            for m in opt_matches:
                t = re.sub(r'\s+', ' ', m.group(2).strip())
                if not t:
                    t = '[Option omitted in original PDF]'
                options.append({
                    'key': m.group(1).upper(),
                    'text': t
                })
                
        next_start = q_starts[i+1] if i < total_q - 1 else len(combined)
        exp_raw = combined[ans_matches[i].end():next_start].strip()
        
        clean_q = format_question_text(q_text_raw)
        clean_exp = format_explanation_text(exp_raw)
        
        questions.append({
            'id': q_id,
            'question': clean_q,
            'options': options,
            'correctAnswer': correct_ans,
            'explanation': clean_exp
        })

    print(f'Successfully extracted all {len(questions)} July 2026 questions.')
    with open('questions_july.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    with open('quiz-app/src/data/questions_july.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print('Saved to questions_july.json and quiz-app/src/data/questions_july.json')

if __name__ == '__main__':
    extract_july()
