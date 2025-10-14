// PDF Report Generation Function for SPECTRE
window.downloadReportPDF = function() {
    if (!window.obfuscationReport) {
        alert('No report available');
        return;
    }
    const report = window.obfuscationReport;
    
    // Debug: Check if password exists
    console.log('DEBUG: Generating PDF report with data:', report);
    console.log('DEBUG: vault_password =', report.vault_password);
    
    // Handle both GCC and LLVM report formats
    const stats = report.obfuscation_statistics || report.statistics || {};
    const inputParams = report.input_parameters || report.input_params || {};
    const outputAttrs = report.output_attributes || {};
    
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Helper function to add text
    const addText = (text, x, y, options = {}) => {
        const fontSize = options.fontSize || 10;
        const maxWidth = options.maxWidth || contentWidth;
        const align = options.align || 'left';
        
        doc.setFontSize(fontSize);
        if (options.bold) doc.setFont(undefined, 'bold');
        else doc.setFont(undefined, 'normal');
        
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y, { align: align });
        return lines.length * (fontSize * 0.5);
    };
    
    // Helper to check page break
    const checkPageBreak = (requiredSpace = 20) => {
        if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPos = 20;
            return true;
        }
        return false;
    };
    
    // Title
    doc.setFillColor(10, 122, 44);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    addText('SPECTRE Obfuscation Report', pageWidth / 2, 25, { fontSize: 20, bold: true, align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos = 50;
    
    // Basic Info
    addText(`Generated: ${report.timestamp || new Date().toISOString()}`, margin, yPos, { fontSize: 10 });
    yPos += 7;
    addText(`Compiler: ${report.compiler || 'LLVM/Clang'}`, margin, yPos, { fontSize: 10 });
    yPos += 7;
    addText(`Method: ${report.obfuscation_method || 'LLVM IR Transformation'}`, margin, yPos, { fontSize: 10 });
    yPos += 10;
    
    // Status
    doc.setFillColor(report.status === 'SUCCESS' ? 212 : 248, report.status === 'SUCCESS' ? 237 : 215, report.status === 'SUCCESS' ? 218 : 218);
    doc.rect(margin, yPos, contentWidth, 15, 'F');
    doc.setTextColor(report.status === 'SUCCESS' ? 21 : 114, report.status === 'SUCCESS' ? 87 : 28, report.status === 'SUCCESS' ? 36 : 36);
    addText(`Status: ${report.status}`, pageWidth / 2, yPos + 10, { fontSize: 14, bold: true, align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 20;
    
    // SIH Badge
    if (report.llvm_specific && report.llvm_specific.sih_compliant) {
        checkPageBreak();
        doc.setFillColor(0, 123, 255);
        doc.rect(margin, yPos, contentWidth, 10, 'F');
        doc.setTextColor(255, 255, 255);
        addText('SIH Compliant - Object File Obfuscation', pageWidth / 2, yPos + 7, { fontSize: 10, bold: true, align: 'center' });
        doc.setTextColor(0, 0, 0);
        yPos += 15;
    }
    
    // ========== EXECUTIVE SUMMARY ==========
    checkPageBreak(50);
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setTextColor(10, 122, 44);
    addText('EXECUTIVE SUMMARY', margin + 2, yPos + 6, { fontSize: 12, bold: true });
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    // Quick stats summary
    const summaryItems = [];
    if (stats.obfuscation_cycles) summaryItems.push(`${stats.obfuscation_cycles} obfuscation cycles`);
    if (stats.strings_encrypted) summaryItems.push(`${stats.strings_encrypted} strings encrypted`);
    if (stats.bogus_code_lines) summaryItems.push(`${stats.bogus_code_lines} bogus code lines`);
    if (stats.control_flow_changes) summaryItems.push(`${stats.control_flow_changes} control flow changes`);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const summaryText = `This report documents the obfuscation process completed on ${new Date(report.timestamp || Date.now()).toLocaleDateString()}. The code was successfully transformed using ${report.compiler || 'LLVM/Clang'} with ${summaryItems.join(', ')}.`;
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 10);
    summaryLines.forEach(line => {
        doc.text(line, margin + 5, yPos);
        yPos += 5;
    });
    yPos += 10;
    
    // Vault Password Section
    if (report.vault_password) {
        checkPageBreak(50);
        doc.setFillColor(102, 126, 234);
        doc.rect(margin, yPos, contentWidth, 45, 'F');
        doc.setTextColor(255, 255, 255);
        addText('Code Vault Password', pageWidth / 2, yPos + 10, { fontSize: 14, bold: true, align: 'center' });
        
        doc.setFillColor(255, 255, 255);
        doc.rect(margin + 10, yPos + 15, contentWidth - 20, 20, 'F');
        doc.setTextColor(102, 126, 234);
        addText(report.vault_password, pageWidth / 2, yPos + 27, { fontSize: 12, bold: true, align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        const passwordType = report.password_auto_generated ? 'AUTO-GENERATED' : 'CUSTOM';
        addText(`${passwordType} | Length: ${report.vault_password.length} characters`, pageWidth / 2, yPos + 40, { fontSize: 8, align: 'center' });
        doc.setTextColor(0, 0, 0);
        yPos += 50;
        
        // Warning box
        checkPageBreak(30);
        doc.setFillColor(255, 243, 205);
        doc.rect(margin, yPos, contentWidth, 25, 'F');
        doc.setTextColor(133, 100, 4);
        addText('Important: Keep this password secure! Users need it to run the protected executable.', margin + 5, yPos + 8, { fontSize: 9, maxWidth: contentWidth - 10 });
        addText('Distribute password separately from the executable.', margin + 5, yPos + 16, { fontSize: 9, maxWidth: contentWidth - 10 });
        doc.setTextColor(0, 0, 0);
        yPos += 30;
    }
    
    // ========== INPUT PARAMETERS SECTION ==========
    checkPageBreak(60);
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setTextColor(10, 122, 44);
    addText('INPUT PARAMETERS', margin + 2, yPos + 6, { fontSize: 12, bold: true });
    doc.setTextColor(0, 0, 0);
    yPos += 12;
    
    // Create a table-like structure for input parameters
    // Check if password protection is actually enabled (by checking if vault_password exists)
    const isPasswordProtected = report.vault_password ? true : (inputParams.password_protected || false);
    const isVerificationEnabled = report.verification ? true : (inputParams.verification_enabled || false);
    
    const inputData = [
        ['Obfuscation Level', inputParams.obfuscation_level || 'balanced'],
        ['Target Platform', inputParams.platform || 'windows'],
        ['Compiler', report.compiler || 'LLVM/Clang'],
        ['Password Protected', isPasswordProtected ? 'Yes' : 'No'],
        ['Verification Enabled', isVerificationEnabled ? 'Yes' : 'No'],
        ['Obfuscation Method', report.obfuscation_method || 'LLVM IR Transformation']
    ];
    
    inputData.forEach(([key, value]) => {
        checkPageBreak(10);
        doc.setFont(undefined, 'bold');
        doc.text(key + ':', margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), margin + 70, yPos);
        yPos += 7;
    });
    yPos += 5;
    
    // ========== OUTPUT FILE ATTRIBUTES SECTION ==========
    checkPageBreak(60);
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setTextColor(10, 122, 44);
    addText('OUTPUT FILE ATTRIBUTES', margin + 2, yPos + 6, { fontSize: 12, bold: true });
    doc.setTextColor(0, 0, 0);
    yPos += 12;
    
    // File size information with visual indicators
    const outputData = [];
    if (outputAttrs.original_size_bytes) {
        outputData.push(['Original File Size', `${outputAttrs.original_size_bytes} bytes`]);
    }
    if (outputAttrs.obfuscated_size_bytes) {
        outputData.push(['Obfuscated File Size', `${outputAttrs.obfuscated_size_bytes} bytes`]);
        if (outputAttrs.original_size_bytes) {
            const increase = ((outputAttrs.obfuscated_size_bytes - outputAttrs.original_size_bytes) / outputAttrs.original_size_bytes * 100).toFixed(1);
            outputData.push(['Size Increase', `${increase}%`]);
        }
    }
    if (outputAttrs.object_file_size) {
        outputData.push(['Object File Size', `${outputAttrs.object_file_size} bytes`]);
    }
    if (outputAttrs.executable_size) {
        outputData.push(['Executable Size', `${outputAttrs.executable_size} bytes`]);
    }
    if (outputAttrs.ir_instructions) {
        outputData.push(['IR Instructions Count', String(outputAttrs.ir_instructions)]);
    }
    // Note: Obfuscation Method is already shown in Input Parameters section
    
    outputData.forEach(([key, value]) => {
        checkPageBreak(10);
        doc.setFont(undefined, 'bold');
        doc.text(key + ':', margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), margin + 70, yPos);
        yPos += 7;
    });
    yPos += 5;
    
    // ========== OBFUSCATION STATISTICS SECTION ==========
    checkPageBreak(100);
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setTextColor(10, 122, 44);
    addText('OBFUSCATION STATISTICS & METRICS', margin + 2, yPos + 6, { fontSize: 12, bold: true });
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    // Key Metrics Boxes (Highlighted)
    const keyMetrics = [];
    if (stats.obfuscation_cycles !== undefined) {
        keyMetrics.push(['Obfuscation Cycles', stats.obfuscation_cycles, 'Number of transformation passes completed']);
    }
    if (stats.strings_encrypted !== undefined) {
        keyMetrics.push(['Strings Encrypted', stats.strings_encrypted, 'Total string literals encrypted']);
    }
    if (stats.bogus_code_lines !== undefined) {
        keyMetrics.push(['Bogus Code Lines', stats.bogus_code_lines, 'Fake/decoy code lines inserted']);
    }
    
    // Draw key metrics in highlighted boxes
    keyMetrics.forEach(([label, value, description]) => {
        checkPageBreak(25);
        doc.setFillColor(230, 255, 230);
        doc.rect(margin, yPos, contentWidth, 20, 'F');
        doc.setDrawColor(10, 122, 44);
        doc.rect(margin, yPos, contentWidth, 20);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(10, 122, 44);
        doc.text(label, margin + 5, yPos + 7);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 100, 0);
        doc.text(String(value), margin + 5, yPos + 15);
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(description, margin + 40, yPos + 15);
        
        doc.setTextColor(0, 0, 0);
        yPos += 25;
    });
    
    yPos += 5;
    
    // Additional Statistics
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(10, 122, 44);
    doc.text('Additional Transformation Details:', margin, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 8;
    
    const additionalStats = [];
    if (stats.control_flow_changes !== undefined) {
        additionalStats.push(['Control Flow Changes', stats.control_flow_changes]);
    }
    if (stats.constants_encoded !== undefined) {
        additionalStats.push(['Constants Encoded', stats.constants_encoded]);
    }
    if (stats.ir_transformations !== undefined) {
        additionalStats.push(['IR Transformations', stats.ir_transformations]);
    }
    if (stats.variables_renamed !== undefined) {
        additionalStats.push(['Variables Renamed', stats.variables_renamed]);
    }
    if (stats.compilation_time !== undefined) {
        additionalStats.push(['Compilation Time', `${stats.compilation_time.toFixed(2)}s`]);
    }
    
    // Anti-Analysis Protection Stats
    if (stats.anti_debug_checks !== undefined) {
        additionalStats.push(['Anti-Debug Checks', stats.anti_debug_checks]);
    }
    if (stats.vm_detection_checks !== undefined) {
        additionalStats.push(['VM Detection Checks', stats.vm_detection_checks]);
    }
    if (stats.sandbox_detection_checks !== undefined) {
        additionalStats.push(['Sandbox Detection Checks', stats.sandbox_detection_checks]);
    }
    if (stats.timing_checks !== undefined) {
        additionalStats.push(['Timing Checks', stats.timing_checks]);
    }
    if (stats.total_protections !== undefined) {
        additionalStats.push(['Total Landmine Protections', stats.total_protections]);
    }
    if (stats.opaque_predicates !== undefined) {
        additionalStats.push(['Opaque Predicates', stats.opaque_predicates]);
    }
    
    additionalStats.forEach(([key, value]) => {
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(key + ':', margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), margin + 70, yPos);
        yPos += 7;
    });
    
    // LLVM Passes Applied
    if (stats.llvm_passes_applied && stats.llvm_passes_applied.length > 0) {
        yPos += 5;
        checkPageBreak(20);
        doc.setFont(undefined, 'bold');
        doc.text('LLVM Passes Applied:', margin + 5, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');
        const passesText = stats.llvm_passes_applied.join(', ');
        const lines = doc.splitTextToSize(passesText, contentWidth - 10);
        lines.forEach(line => {
            checkPageBreak(10);
            doc.text(line, margin + 10, yPos);
            yPos += 6;
        });
    }
    
    yPos += 10;
    
    // Bogus Code Information Box
    if (stats.bogus_code_lines !== undefined && stats.bogus_code_lines > 0) {
        checkPageBreak(35);
        doc.setFillColor(255, 250, 230);
        doc.rect(margin, yPos, contentWidth, 30, 'F');
        doc.setDrawColor(200, 180, 100);
        doc.rect(margin, yPos, contentWidth, 30);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(150, 100, 0);
        doc.text('Bogus Code Generation Summary', margin + 5, yPos + 8);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const bogusInfo = `Generated ${stats.bogus_code_lines} lines of decoy code to confuse reverse engineering attempts. This fake code appears legitimate but does not affect program logic, making static analysis significantly more difficult.`;
        const bogusLines = doc.splitTextToSize(bogusInfo, contentWidth - 10);
        let tempY = yPos + 16;
        bogusLines.forEach(line => {
            doc.text(line, margin + 5, tempY);
            tempY += 5;
        });
        
        yPos += 35;
    }
    
    yPos += 5;
    
    // ========== LANDMINE PROTECTION SUMMARY ==========
    if (stats.total_protections && stats.total_protections > 0) {
        checkPageBreak(45);
        doc.setFillColor(255, 230, 230);
        doc.rect(margin, yPos, contentWidth, 40, 'F');
        doc.setDrawColor(200, 50, 50);
        doc.rect(margin, yPos, contentWidth, 40);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(150, 0, 0);
        doc.text('LANDMINE PROTECTION ACTIVE', margin + 5, yPos + 8);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const landmineInfo = `This code is protected with ${stats.total_protections} aggressive anti-analysis landmines. If executed in a VM, sandbox, or debugger, the code will: (1) Ban the device by recording hardware fingerprint, (2) Trigger system crash/BSOD, (3) Corrupt memory to prevent analysis. These protections include ${stats.anti_debug_checks || 0} anti-debug checks, ${stats.vm_detection_checks || 0} VM detection checks, ${stats.sandbox_detection_checks || 0} sandbox detection checks, and ${stats.timing_checks || 0} timing-based checks.`;
        const landmineLines = doc.splitTextToSize(landmineInfo, contentWidth - 10);
        let tempY = yPos + 16;
        landmineLines.forEach(line => {
            doc.text(line, margin + 5, tempY);
            tempY += 5;
        });
        
        yPos += 45;
    }
    
    yPos += 5;
    
    // Verification Result
    if (report.verification) {
        checkPageBreak(30);
        addText('Verification Result', margin, yPos, { fontSize: 14, bold: true });
        yPos += 8;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;
        addText(`Verified: ${report.verification.verified ? 'Yes' : 'No'}`, margin, yPos, { fontSize: 10 });
        yPos += 7;
        addText(`Reason: ${report.verification.reason || 'N/A'}`, margin, yPos, { fontSize: 10, maxWidth: contentWidth });
        yPos += 10;
    }
    
    // Security Score
    if (report.security_score) {
        checkPageBreak(20);
        addText('Security Score', margin, yPos, { fontSize: 14, bold: true });
        yPos += 8;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;
        addText(`${report.security_score}/100`, margin, yPos, { fontSize: 12, bold: true });
        yPos += 10;
    }
    
    // ========== FOOTER ON ALL PAGES ==========
    const pageCount = doc.internal.getNumberOfPages();
    const reportId = `SPECTRE-${Date.now().toString(36).toUpperCase()}`;
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, doc.internal.pageSize.getHeight() - 15, pageWidth - margin, doc.internal.pageSize.getHeight() - 15);
        
        // Footer text
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'normal');
        doc.text('SPECTRE Obfuscator - Confidential Report', margin, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Report ID: ${reportId}`, margin, doc.internal.pageSize.getHeight() - 5);
        
        doc.setFont(undefined, 'bold');
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text(new Date(report.timestamp || Date.now()).toLocaleDateString(), pageWidth - margin, doc.internal.pageSize.getHeight() - 5, { align: 'right' });
    }
    
    // Save the PDF with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`SPECTRE_Obfuscation_Report_${timestamp}.pdf`);
};
