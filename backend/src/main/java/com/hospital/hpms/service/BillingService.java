package com.hospital.hpms.service;

import com.hospital.hpms.entity.Bill;
import com.hospital.hpms.entity.enums.BillStatus;
import com.hospital.hpms.exception.ResourceNotFoundException;
import com.hospital.hpms.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;

    @Transactional
    public Bill generate(Bill bill) {
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setBalanceAmount(bill.getTotalAmount());
        bill.setStatus(BillStatus.PENDING);
        return billRepository.save(bill);
    }

    public List<Bill> getByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    @Transactional
    public Bill recordPayment(Long billId, BigDecimal amount) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        BigDecimal newPaid = bill.getPaidAmount().add(amount);
        bill.setPaidAmount(newPaid);
        BigDecimal balance = bill.getTotalAmount().subtract(newPaid);
        bill.setBalanceAmount(balance);

        if (balance.compareTo(BigDecimal.ZERO) <= 0) {
            bill.setStatus(BillStatus.PAID);
        } else if (newPaid.compareTo(BigDecimal.ZERO) > 0) {
            bill.setStatus(BillStatus.PARTIAL);
        }
        return billRepository.save(bill);
    }
}
