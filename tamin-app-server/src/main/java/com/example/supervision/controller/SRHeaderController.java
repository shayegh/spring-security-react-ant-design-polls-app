package com.example.supervision.controller;

import com.example.supervision.exception.ResourceNotFoundException;
import com.example.supervision.model.supervision.SRHeader;
import com.example.supervision.model.supervision.SRHeaderStatus;
import com.example.supervision.payload.ApiResponse;
import com.example.supervision.payload.PagedResponse;
import com.example.supervision.repository.SRHeaderRepository;
import com.example.supervision.security.CurrentUser;
import com.example.supervision.security.UserPrincipal;
import com.example.supervision.service.SRService;
import com.example.supervision.util.AppConstants;
import com.example.supervision.util.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Optional;

import static com.example.supervision.util.Utils.getJsonPropertyString;

/**
 * Created by Shayegh@gmail.com on ۱۶/۱۱/۲۰۱۹ - ۱۰:۱۰ قبل‌ازظهر.
 */
@Slf4j
@RestController
@RequestMapping("/api")
public class SRHeaderController {
    @Autowired
    private SRService srService;

    @Autowired
    private SRHeaderRepository headerRepository;

    @PostMapping(path = "/headers")
    @PreAuthorize("hasRole('ED_BOSS')")
    public ResponseEntity<?> createHeader(@Valid @RequestBody SRHeader srHeader) {
        srHeader.setStatus(SRHeaderStatus.NEW.name());
        SRHeader header = srService.createSRHeader(srHeader);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/headers/{headerId}")
                .buildAndExpand(header.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Header Created Successfully", header.getId()));
    }

    @GetMapping(path = "/headers")
    @PreAuthorize("hasAnyRole('SHOB_BOSS','SHOB_UNIT_BOSS','ED_BOSS','ADMIN')")
    public PagedResponse<SRHeader> getHeaders(@CurrentUser UserPrincipal currentUser,
                                              @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                              @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        if (Utils.hasRole("ROLE_USER"))
            log.debug("USER has role USER");
        return srService.getAllHeaders(currentUser, page, size);
    }

    @GetMapping(path = "/headers/{headerId}")
    @PreAuthorize("hasAnyRole('SHOB_BOSS','SHOB_UNIT_BOSS','ED_BOSS','ADMIN')")
    public SRHeader getHeader(@PathVariable Long headerId) {
        return headerRepository.findById(headerId)
                .orElseThrow(() -> new ResourceNotFoundException("Header", "HeaderId ", headerId));

    }

    @PutMapping(path = "/headers/{headerId}", produces = "application/json")
    @PreAuthorize("hasRole('ED_BOSS')")
    public ResponseEntity<?> updateHeader(@PathVariable Long headerId, @Valid @RequestBody SRHeader headerRequest) {
        Optional<SRHeader> header = headerRepository.findById(headerId);
        if (!header.isPresent())
            return ResponseEntity.notFound().build();
        SRHeader srHeader = header.get();
        headerRequest.setId(headerId);
        headerRequest.setCreatedAt(srHeader.getCreatedAt());
        headerRequest.setCreatedBy(srHeader.getCreatedBy());
        headerRepository.save(headerRequest);
        return ResponseEntity.ok(new ApiResponse(true, "Report Updated Successfully", headerId));
    }

    @PutMapping(path = "/headers/{headerId}/cr")
    @PreAuthorize("hasAnyRole('SHOB_BOSS','SHOB_UNIT_BOSS','ED_BOSS')")
    public ResponseEntity<?> confirmHeaderStatus(@PathVariable Long headerId, @Valid @RequestBody String headerRequest) {
        log.debug("Header Request: {}", headerRequest);
        String status = getJsonPropertyString(headerRequest, "status");

        Optional<SRHeader> header = headerRepository.findById(headerId);
        if (!header.isPresent())
            return ResponseEntity.notFound().build();
        SRHeader srHeader = header.get();
        srHeader.setStatus(status);
        headerRepository.save(srHeader);
        return ResponseEntity.ok(new ApiResponse(true, "Report Confirmed Successfully", headerId));
    }

    @DeleteMapping("/headers/{headerId}")
    @PreAuthorize("hasRole('ED_BOSS')")
    public ResponseEntity<?> deleteHeader(@PathVariable Long headerId) {
        log.debug("Header Id :{}", headerId);
        headerRepository.deleteById(headerId);
        return ResponseEntity.ok(new ApiResponse(true, "Report Deleted Successfully"));

    }
}